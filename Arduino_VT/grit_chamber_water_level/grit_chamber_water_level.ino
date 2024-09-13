
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//Sensor and Motor Ports
#define WATER_LEVEL_SIGNAL A0

//Broker Information
String broker = "192.168.8.210"; 
String mqtt_username = "smartmqtt";
String mqtt_password = "HokieDVE";
String port = "1883"; 
WiFiClient espClient;
PubSubClient client(espClient);
//WIFI Information 
const char* ssid = "Testbed-W";
const char* ssid_pass = "HokieDVE";
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(1000);
  
  WiFi.begin(ssid, ssid_pass);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

  
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  digitalWrite(BUILTIN_LED, LOW);
}

void reconnect() {
  uint16_t converted_port = static_cast<uint16_t>(port.toInt());
  IPAddress ip = IPAddress();
  ip.fromString(broker);

  client.setServer(ip, converted_port);
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqtt_username.c_str(), mqtt_password.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    digitalWrite(BUILTIN_LED, HIGH);
    reconnect();
    digitalWrite(BUILTIN_LED, LOW);
  }
  client.loop();
  //Listens for water pump commands
  int value = analogRead(WATER_LEVEL_SIGNAL);
  String water_level = String(value);
  client.publish("grit_chamber/level", water_level.c_str());
  delay(1000);
}
