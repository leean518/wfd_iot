#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// PINOUTS
#define SIGNAL_PIN A0
#define testpin 2
#define pin1 13

int value = 0;  // variable to store the sensor value

//WIFI Information
const char* ssid = "hydro";
const char* ssid_pass = "hydrohydro";

//Broker Information
String broker;
String username;
String password;
String port;

//Node information
String topic_level;

//URL information
const char* global_URL = "http://192.168.1.179:8080/api/collections/global/records/r1en4aa61ndcg6y";
const char* node_URL = "http://192.168.1.179:8080/api/collections/topics/records/";

//topic information
const char* endpoints[] = { "grit_level_0000" };

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

  pinMode(SIGNAL_PIN, INPUT);

  grabGlobalInformation();
  grabLevelInformation();

  Serial.print("Broker: ");
  Serial.println(broker);
  Serial.print("port: ");
  Serial.println(port);

  connectMQTT();
}

void loop() {

  value = analogRead(SIGNAL_PIN);

  Serial.print("Sensor value: ");
  Serial.println(value);

  Serial.println("------------------------- ");

  char str[20];
  sprintf(str, "%d", value);

  const char* topic = topic_level.c_str();

  client.publish(topic, str);
  Serial.printf("Published %s to %s\n", str, topic);
  client.loop();
  delay(1000);
}

void connectMQTT() {
  uint16_t converted_port = static_cast<uint16_t>(port.toInt());
  IPAddress ip = IPAddress();
  ip.fromString(broker);

  client.setServer(ip, converted_port);
  client.setCallback(callback);

  while (!client.connected()) {
    const char* client_id = "esp8266-client-level";  // ADD UNIQUE ID
    Serial.println("Connecting to mqtt broker.....");
    if (client.connect(client_id)) {
      Serial.println("Connected to broker");
    } else {
      Serial.print("failed with state ");
      Serial.println(client.state());
      delay(2000);
    }
  }

  client.subscribe(topic_level.c_str());  //SUBSCRIBE TO TOPICS
}

void callback(char* topic, byte* payload, unsigned int length) {

  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message: ");

  String message;
  for (int i = 0; i < length; i++) {
    message = message + (char)payload[i];
  }
  Serial.print(message);

  Serial.println();
  Serial.println("-----------------------");
}

void grabGlobalInformation() {
  HTTPClient http;
  WiFiClient client;
  http.begin(client, global_URL);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String payload = http.getString();

    DynamicJsonDocument doc_broker(1024);
    deserializeJson(doc_broker, payload);
    DynamicJsonDocument doc_user(1024);
    deserializeJson(doc_user, payload);
    DynamicJsonDocument doc_pass(1024);
    deserializeJson(doc_pass, payload);
    DynamicJsonDocument doc_port(1024);
    deserializeJson(doc_port, payload);

    const char* data;
    data = doc_broker["broker"];
    broker = String(data);

    data = doc_user["username"];
    username = String(data);

    data = doc_pass["password"];
    password = String(data);

    data = doc_port["port"];
    port = String(data);

  } else {
    Serial.print("HTTP request failed with error code ");
    Serial.println(httpCode);
  }
  http.end();
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

void grabLevelInformation() {
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

    DynamicJsonDocument doc_level(1024);
    deserializeJson(doc_level, payload);

    const char* data;
    data = doc_level["topic"];
    topic_level = String(data);

  } else {
    Serial.print("HTTP request failed with error code ");
    Serial.println(httpCode);
  }
  http.end();

  memset(fullURL, 0, sizeof(fullURL));
  strcpy(fullURL, node_URL);
  strcat(fullURL, endpoints[1]);

  Serial.println("=======JSON DATA=========");
  Serial.print("Water level topic: ");
  Serial.println(topic_level);
  Serial.println("=========================");
}
