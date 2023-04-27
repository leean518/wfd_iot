#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// PINOUTS
#define pin1 13
#define testpin 2
#define tdsPin A0
#define VREF 3.3             
#define SCOUNT  30            

int analogBuffer[SCOUNT];     
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
int copyIndex = 0;

float averageVoltage = 0.0;
float tdsValue = 0.0;
float temperature = 23.0;

//WIFI Information 
const char* ssid = "hydro";
const char* ssid_pass = "hydrohydro";

//Broker Information
String broker ; 
String username;
String password;
String port; 

//Node information
String topic_pump;
String topic_tds; 

//URL information
const char* global_URL = "http://192.168.1.179:8080/api/collections/global/records/r1en4aa61ndcg6y";
const char* node_URL = "http://192.168.1.179:8080/api/collections/topics/records/";

//topic information (USING GRIT CHAMBER AS AN EXAMPLE)
const char* endpoints[] = {"grit_pump_00000","grit_tds_000000"};

//MQTT conn
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  WiFi.begin(ssid, ssid_pass);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

  pinMode(pin1, OUTPUT);
  pinMode(testpin, OUTPUT);
  pinMode(tdsPin, INPUT);

  grabGlobalInformation();
  grabPumpInformation();
  grabTDSInformation();

 Serial.print("Broker: "); Serial.println(broker);
 Serial.print("port: "); Serial.println(port);
 Serial.print("topic_tds: "); Serial.println(topic_tds);
 Serial.print("topic_pump: "); Serial.println(topic_pump);
 
  connectMQTT();
}

void loop() {

  static unsigned long analogSampleTimepoint = millis();
  
  if(millis()-analogSampleTimepoint > 40U){     
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(tdsPin);   
    analogBufferIndex++;
    if(analogBufferIndex == SCOUNT){ 
      analogBufferIndex = 0;
    }

  }   
  
  static unsigned long printTimepoint = millis();
  if(millis()-printTimepoint > 800U){
    printTimepoint = millis();
    for(copyIndex=0; copyIndex<SCOUNT; copyIndex++){
      analogBufferTemp[copyIndex] = analogBuffer[copyIndex];
      
      averageVoltage = getMedianNum(analogBufferTemp,SCOUNT) * (float)VREF / 1024.0;
      float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
      float compensationVoltage = averageVoltage / compensationCoefficient;
      tdsValue = (133.42 * compensationVoltage * compensationVoltage * compensationVoltage - 255.86 * compensationVoltage * compensationVoltage + 857.39 * compensationVoltage) * 0.5;

      
      Serial.print("TDS Value: ");
      Serial.print(analogRead(tdsPin));
      Serial.println(" ppm");

      char str[20];
      sprintf(str, "%i",analogRead(tdsPin));
      
      const char* test = topic_tds.c_str();

      client.publish(test, str);
      delay(500);
      client.loop();  

    }
  }
   
}

int getMedianNum(int bArray[], int iFilterLen){
  int bTab[iFilterLen];
  for (byte i = 0; i<iFilterLen; i++)
  bTab[i] = bArray[i];
  int i, j, bTemp;
  for (j = 0; j < iFilterLen - 1; j++) {
    for (i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  if ((iFilterLen & 1) > 0){
    bTemp = bTab[(iFilterLen - 1) / 2];
  }
  else {
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  }
  return bTemp;
}

void connectMQTT(){
  uint16_t converted_port = static_cast<uint16_t>(port.toInt());
  IPAddress ip = IPAddress();
  ip.fromString(broker);

  client.setServer(ip, converted_port);
  client.setCallback(callback);

  while (!client.connected()) {
      const char *client_id = "esp8266-client-tds-pump-grit";
      Serial.println("Connecting to mqtt broker.....");
      if (client.connect(client_id)) {
          Serial.println("Connected to broker");
      } 
      else {
          Serial.print("failed with state ");
          Serial.println(client.state());
          delay(2000);
      }
  }
    
  client.subscribe(topic_tds.c_str());
  client.subscribe(topic_pump.c_str());
}

void callback(char *topic, byte *payload, unsigned int length) {

    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message: ");

    String message;
    for (int i = 0; i < length; i++) {
        message = message + (char) payload[i]; 
    }
    Serial.print(message);

    if (strcmp(topic,topic_pump.c_str())==0) {
      if (message == "off") { 
        digitalWrite(pin1, LOW);
        digitalWrite(testpin, LOW);
      }   
      if (message == "on") {
        digitalWrite(pin1, HIGH);
        digitalWrite(testpin, HIGH); 
      }
    }

    Serial.println();
    Serial.println("-----------------------");
}

void grabTDSInformation(){
  HTTPClient http;
  WiFiClient client;
  int httpCode;

  char fullURL[87];

  strcpy(fullURL, node_URL);
  strcat(fullURL, endpoints[1]);

  http.begin(client, fullURL);
  httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    DynamicJsonDocument doc_tds(1024);
    deserializeJson(doc_tds, payload);
    
    const char* data;
    data =  doc_tds["topic"];
    topic_tds = String(data);

  }
  else {
      Serial.print("HTTP request failed with error code ");
      Serial.println(httpCode);
  }
  http.end();

  Serial.println("=======JSON DATA=========");
  Serial.print("TDS topic: "); Serial.println(topic_tds);
  Serial.println("=========================");  
 
}

void grabPumpInformation(){
  HTTPClient http;
  WiFiClient client;
  int httpCode;

  char fullURL[87];

  strcpy(fullURL, node_URL);
  strcat(fullURL, endpoints[0]);

  http.begin(client, fullURL);
  httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    DynamicJsonDocument doc_pump(1024);
    deserializeJson(doc_pump, payload);
    
    const char* data;
    data = doc_pump["topic"];
    topic_pump = String(data);

  }
  else {
      Serial.print("HTTP request failed with error code ");
      Serial.println(httpCode);
  }
  http.end();

  memset(fullURL, 0, sizeof(fullURL));
  strcpy(fullURL, node_URL);
  strcat(fullURL, endpoints[1]);
  
  Serial.println("=======JSON DATA=========");
  Serial.print("Pump topic: "); Serial.println(topic_pump);
  Serial.println("=========================");  
 
}

void grabGlobalInformation(){
  HTTPClient http;
  WiFiClient client;
  http.begin(client, global_URL);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    DynamicJsonDocument doc_broker(1024); deserializeJson(doc_broker, payload);
    DynamicJsonDocument doc_user(1024); deserializeJson(doc_user, payload);
    DynamicJsonDocument doc_pass(1024); deserializeJson(doc_pass, payload);
    DynamicJsonDocument doc_port(1024); deserializeJson(doc_port, payload);

    const char* data;
    data = doc_broker["broker"];
    broker = String(data); 
    
    data = doc_user["username"];
    username = String(data);

    data = doc_pass["password"];
    password = String(data);

    data = doc_port["port"];
    port = String(data);

  }
  else {
      Serial.print("HTTP request failed with error code ");
      Serial.println(httpCode);
    }

  Serial.println("=======JSON DATA=========");
  Serial.print("broker: "); Serial.println(broker);
  Serial.print("username: "); Serial.println(username);
  Serial.print("password: "); Serial.println(password);
  Serial.print("port: "); Serial.println(port);
  Serial.println("=========================");  
  http.end();
}
