#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// PINOUTS
#define pin1 5
#define pin2 16
#define pumpPin 13
#define testpin 2
#define levelPin A0
int value;

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
String topic_level;
String topic_scraper; 

//URL information
const char* global_URL = "http://192.168.1.179:8080/api/collections/global/records/r1en4aa61ndcg6y";
const char* node_URL = "http://192.168.1.179:8080/api/collections/topics/records/";

//topic information 
const char* endpoints[] = {"primary_pump_01","primary_scraper","primary_level_0"};

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
  pinMode(pin2, OUTPUT);
  pinMode(pumpPin, OUTPUT);
  pinMode(testpin, OUTPUT);
  pinMode(levelPin, INPUT);
    digitalWrite(pumpPin, LOW); 
    digitalWrite(testpin, LOW); 

  grabGlobalInformation();
  grabPumpInformation();
  grabLevelInformation();
  grabScraperInformation();

 Serial.print("Broker: "); Serial.println(broker);
 Serial.print("port: "); Serial.println(port);
 
  connectMQTT();
}

void loop() {
  delay(10);                      // wait 10 milliseconds
  value = analogRead(levelPin); // read the analog value from sensor

  Serial.print("Water Level: ");
  Serial.println(value);

  Serial.println("------------------------- ");

      char str[20];
      sprintf(str, "%d",value);

  const char* topic = topic_level.c_str();
  client.publish(topic, str);
  Serial.println("Published to mqtt");

  client.loop();

  delay(1000);
  client.loop();  
}

void connectMQTT(){
  uint16_t converted_port = static_cast<uint16_t>(port.toInt());
  IPAddress ip = IPAddress();
  ip.fromString(broker);

  client.setServer(ip, converted_port);
  client.setCallback(callback);

  while (!client.connected()) {
      const char *client_id = "esp8266-client-primary-scraper-level-pump"; 
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
    
  client.subscribe(topic_pump.c_str());  
  client.subscribe(topic_scraper.c_str());
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

//FOR PUMPS 
    if (strcmp(topic,topic_pump.c_str())==0) {
      if (message == "on") { 
        digitalWrite(pumpPin, HIGH);  
        digitalWrite(testpin, HIGH);
      }   
      if (message == "off") {
        digitalWrite(pumpPin, LOW ); 
        digitalWrite(testpin, LOW); 
      }
    }

    if (strcmp(topic,topic_scraper.c_str())==0) {
        if (message == "left") { 
          digitalWrite(pin1, LOW);
          digitalWrite(pin2, HIGH);
          digitalWrite(testpin, LOW);
        }  
        if (message == "right") {
          digitalWrite(pin1, HIGH);
          digitalWrite(pin2, LOW);
          digitalWrite(testpin, LOW); 
        }
        if (message =="off") {
          digitalWrite(pin1, HIGH);
          digitalWrite(pin2, HIGH);
          digitalWrite(testpin, HIGH); 
        }
      }

    Serial.println();
    Serial.println("-----------------------");
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
  
  Serial.println("=======JSON DATA=========");
  Serial.print("Pump topic: "); Serial.println(topic_pump);
  Serial.println("=========================");  
 
}

void grabLevelInformation(){ 
  HTTPClient http;
  WiFiClient client;
  int httpCode;

  char fullURL[87];

  strcpy(fullURL, node_URL);
  strcat(fullURL, endpoints[2]);

  http.begin(client, fullURL);
  httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    DynamicJsonDocument doc_level(1024);
    deserializeJson(doc_level, payload);
    
    const char* data;
    data = doc_level["topic"];
    topic_level = String(data);

  }
  else {
      Serial.print("HTTP request failed with error code ");
      Serial.println(httpCode);
  }
  http.end();
  
  Serial.println("=======JSON DATA=========");
  Serial.print("Level topic: "); Serial.println(topic_level);
  Serial.println("========================="); 
}

void grabScraperInformation(){  
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

    DynamicJsonDocument doc_scraper(1024);
    deserializeJson(doc_scraper, payload);
    
    const char* data;
    data = doc_scraper["topic"];
    topic_scraper = String(data);

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
  Serial.print("Scraper topic: "); Serial.println(topic_scraper);
  Serial.println("========================="); 
  }