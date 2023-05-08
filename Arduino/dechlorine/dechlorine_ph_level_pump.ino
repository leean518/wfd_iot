#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>

WiFiClient wifiClient;
HttpClient httpClient = HttpClient(wifiClient, "192.168.1.179", 8080);
MqttClient mqttClient(wifiClient);

//Broker Information
String broker;
String username;
String password;
String port;

String topic_level;
String topic_pump;
String topic_ph;

const char* endpoints[] = {"chlorine_ph_000","chlorine_level_","chlorine_pump_0"};

#define SensorPin A0 
#define LED 13
#define SIGNAL_PIN A1
#define pin1 20
#define ground 7
#define GND_PIN 2 

//URL information
const char* global_URL = "http://192.168.1.179:8080/api/collections/global/records/r1en4aa61ndcg6y";
const char* nodePath = "/api/collections/topics/records/";

int samples = 10;
float adc_resolution = 1024.0;

float ph (float voltage) {
    return 7 + ((2.5 - voltage) / 0.18);
}

void setup() {
  Serial.begin(9600);
  
  Serial.println("Serial initialized");

  // Connect to Wi-Fi
  WiFi.begin("hydro", "hydrohydro");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  pinMode(pin1, OUTPUT);
  pinMode(ground, OUTPUT);
  digitalWrite(ground, LOW);
  pinMode(GND_PIN, OUTPUT);
  digitalWrite(GND_PIN, LOW); 
  pinMode(LED,OUTPUT);

  getGlobal();
  getLevelInformation();
  getPumpInformation();
  getPhInformation();
  mqttConn();
}

void loop() {
  mqttClient.poll();
  mqttClient.poll();

  int measurings = 0;
  int value = analogRead(SIGNAL_PIN);

  for (int i = 0; i < samples; i++){
    measurings += analogRead(SensorPin);
    delay(10);
  }

  float voltage = 5 / adc_resolution * measurings/samples;

  mqttClient.beginMessage(topic_ph);
  mqttClient.print(voltage,2);
  mqttClient.endMessage();

  Serial.print("PhValue :" );
  Serial.print(voltage);
  Serial.println();

  mqttClient.beginMessage(topic_level);
  mqttClient.print(value,2);
  mqttClient.endMessage();

  Serial.print("Water lvl :" );
  Serial.print(value);
  Serial.println();

  delay(1000);
}

void mqttConn(){
  uint16_t converted_port = static_cast<uint16_t>(port.toInt());
  IPAddress ip = IPAddress();
  ip.fromString(broker);

  mqttClient.connect(ip, converted_port);
  mqttClient.setUsernamePassword(username, password);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setId("arduino-client-chlorine-ph-level-pump");

  Serial.println("Subscribing to topic...");
  mqttClient.subscribe(topic_pump);
  Serial.println("Subscribed");
}

void getGlobal(){

  httpClient.beginRequest();
  httpClient.get("/api/collections/global/records/r1en4aa61ndcg6y");

  httpClient.sendHeader("Content-Type", "application/json; charset=UTF-8");
  httpClient.endRequest();
 
  // Check the response status
  int status = httpClient.responseStatusCode();
  Serial.print("Response status code: ");
  Serial.println(status);

  // Read the response body
  String responseBody = httpClient.responseBody();
  Serial.print("Response body: ");
  Serial.println(responseBody);

  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, responseBody);
  // Parse the response JSON
  StaticJsonDocument<1024> doc_broker;
  StaticJsonDocument<1024> doc_user;
  StaticJsonDocument<1024> doc_pass;
  StaticJsonDocument<1024> doc_port;

  deserializeJson(doc_broker, responseBody);
  deserializeJson(doc_user, responseBody);
  deserializeJson(doc_pass, responseBody);
  deserializeJson(doc_port, responseBody);

  if (error) {
    Serial.print("Error parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }

  // Access the JSON data
  const char* data ;
  data = doc_broker["broker"];
  broker = String(data);

  data = doc_user["username"];
  username = String(data);

  data = doc_pass["password"];
  password = String(data);

  data = doc_port["port"];
  port = String(data);

  Serial.println("=======JSON DATA=========");
  Serial.print("broker: ");
  Serial.println(broker);
  Serial.print("username: ");
  Serial.println(username);
  Serial.print("password: ");
  Serial.println(password);
  Serial.print("port: ");
  Serial.println(port);
  Serial.println("=========================");

}

void getLevelInformation(){

  char fullURL[87];

  strcpy(fullURL, nodePath);
  strcat(fullURL, endpoints[1]);
  
  httpClient.beginRequest();
  httpClient.get(fullURL);
  httpClient.sendHeader("Content-Type", "application/json");
  httpClient.endRequest();

  // Check the response status
  int status = httpClient.responseStatusCode();
  Serial.print("Response status code: ");
  Serial.println(status);

  // Read the response body
  String responseBody = httpClient.responseBody();

  StaticJsonDocument<512> doc_error_level;
  DeserializationError error = deserializeJson(doc_error_level, responseBody);

  StaticJsonDocument<1024> doc_level;
  deserializeJson(doc_level, responseBody);

  if (error) {
    Serial.print("Error parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }

  // Access the JSON data
  const char* data ;
  data = doc_level["topic"];
  topic_level = String(data);

  Serial.println("=======JSON DATA=========");
  Serial.print("Water level topic: ");
  Serial.println(topic_level);
  Serial.println("=========================");
}

void getPumpInformation(){  
 

  char fullURL[87];

  strcpy(fullURL, nodePath);
  strcat(fullURL, endpoints[2]);

  httpClient.beginRequest();
  httpClient.get(fullURL);
  httpClient.sendHeader("Content-Type", "application/json");
  httpClient.endRequest();

  // Check the response status
  int status = httpClient.responseStatusCode();
  Serial.print("Response status code: ");
  Serial.println(status);

  // Read the response body
  String responseBody = httpClient.responseBody();

  StaticJsonDocument<512> doc_error_pump;
  DeserializationError error = deserializeJson(doc_error_pump, responseBody);

  StaticJsonDocument<1024> doc_pump;
  deserializeJson(doc_pump, responseBody);

  if (error) {
    Serial.print("Error parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }

  // Access the JSON data
  const char* data ;
  data = doc_pump["topic"];
  topic_pump = String(data);

  Serial.println("=======JSON DATA=========");
  Serial.print("Pump topic: ");
  Serial.println(topic_pump);
  Serial.println("=========================");
}

void getPhInformation(){
  

  char fullURL[87];

  strcpy(fullURL, nodePath);
  strcat(fullURL, endpoints[0]);

  httpClient.beginRequest();
  httpClient.get(fullURL);
  httpClient.sendHeader("Content-Type", "application/json");
  httpClient.endRequest();

  // Check the response status
  int status = httpClient.responseStatusCode();
  Serial.print("Response status code: ");
  Serial.println(status);

  // Read the response body
  String responseBody = httpClient.responseBody();

  StaticJsonDocument<512> doc_error_ph;
  DeserializationError error = deserializeJson(doc_error_ph, responseBody);

  StaticJsonDocument<1024> doc_ph;
  deserializeJson(doc_ph, responseBody);

  if (error) {
    Serial.print("Error parsing JSON: ");
    Serial.println(error.c_str());
    return;
  }

  // Access the JSON data
  const char* data ;
  data = doc_ph["topic"];
  topic_ph = String(data);

  Serial.println("=======JSON DATA=========");
  Serial.print("ph level topic: ");
  Serial.println(topic_ph);
  Serial.println("=========================");
}

void onMqttMessage(int messageSize){
  const char* message = mqttClient.messageTopic().c_str();

  Serial.println("--------------------------");
  Serial.print("Received a message with topic '");
  Serial.println(message);

  char messageArr[messageSize + 1] ;
  int count = 0; 
  while (mqttClient.available()) {
    char letter = mqttClient.read();  
    messageArr[count] = letter;
    count++;
  }
  messageArr[count] = '\0';
  Serial.print("Message: ");
  Serial.println(messageArr);
  Serial.println("--------------------------");

  Serial.println(message); Serial.println(topic_pump.c_str());

  if(strcmp(message, topic_pump.c_str()) == 0){

    if (strcmp(messageArr,"off") == 0) { 
      Serial.println("Turning off");
      digitalWrite(pin1, LOW);    
    }   
    if (strcmp(messageArr,"on") == 0) {
      Serial.println("Turning on");
      digitalWrite(pin1, HIGH);
    }
  }
}