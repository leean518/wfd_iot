
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//Sensor and Motor Ports
#define OUTTAKE_PUMP_SIGNAL 12

//Broker Information
String broker = "192.168.8.210"; 
String mqtt_username = "smartmqtt";
String mqtt_password = "HokieDVE";
String port = "1883"; 
WiFiClient espClient;
PubSubClient client(espClient);
//Node information  
String topic_outtake_pump = "acid_solution/outtake_pump";  
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

  pinMode(OUTTAKE_PUMP_SIGNAL, OUTPUT); // Turns on the water pump PIN 12/D6
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  //By default turns off the pumps
  digitalWrite(OUTTAKE_PUMP_SIGNAL, HIGH);
  digitalWrite(BUILTIN_LED, LOW);
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  String message;
  for (int i = 0; i < length; i++) {
      message = message + (char) payload[i]; 
  }
  if (strcmp(topic, topic_outtake_pump.c_str()) == 0)
  {
    if (message == "Turn on") {
        digitalWrite(OUTTAKE_PUMP_SIGNAL, LOW);   // Turn the LED on (Note that LOW is the voltage level
        Serial.println("Pump ON");
        // but actually the LED is on; this is because
        // it is acive low on the ESP-01)
      } else if (message == "Turn off"){
        digitalWrite(OUTTAKE_PUMP_SIGNAL, HIGH);  // Turn the LED off by making the voltage HIGH
        Serial.println("Pump OFF");
      }
  }
 
}

void reconnect() {
  uint16_t converted_port = static_cast<uint16_t>(port.toInt());
  IPAddress ip = IPAddress();
  ip.fromString(broker);

  client.setServer(ip, converted_port);
  client.setCallback(callback);
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqtt_username.c_str(), mqtt_password.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe
      client.subscribe(topic_outtake_pump.c_str());
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
  delay(1000);
}
