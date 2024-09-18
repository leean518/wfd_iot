
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//Sensor and Motor Ports
#define OUTTAKE_PUMP_SIGNAL 12 // Represents the Digital Signal responsible for activating the pump

//Broker Information
String broker = "192.168.8.210"; //Broker IP Address
String mqtt_username = "smartmqtt"; //Broker Username
String mqtt_password = "HokieDVE"; //Broker Password
String port = "1883"; //Broker Port Number
WiFiClient espClient; // NodeMCU library to connect to Wifi.
PubSubClient client(espClient); //MQTT Library to publishing and subscribing to topics.
//MQTT Topic information  
String topic_outtake_pump = "acid_solution/outtake_pump";  
//WIFI Router Information 
const char* ssid = "Testbed-W";
const char* ssid_pass = "HokieDVE";
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(1000);
  //Connects to Wifi Network
  WiFi.begin(ssid, ssid_pass);
  Serial.println("Connecting to WiFi...");
  //Prints message as long as WiFi is not connected.
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

  pinMode(OUTTAKE_PUMP_SIGNAL, OUTPUT); // Turns PIN 12/D6 into a output configuration where it controls the activation of the water pump
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  digitalWrite(OUTTAKE_PUMP_SIGNAL, HIGH); //By default turns off the pumps
  digitalWrite(BUILTIN_LED, LOW);//Turns on NodeMCU LED
}

//Method responsible for processing incoming MQTT messages
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic); //MQTT Topic that message is received on
  Serial.print("] ");
  //Prints out the content of the message
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  //Forumulates MQTT message
  String message;
  for (int i = 0; i < length; i++) {
      message = message + (char) payload[i]; 
  }
  //Ensures the MQTT topic we receive a message on is of relevance
  if (strcmp(topic, topic_outtake_pump.c_str()) == 0)
  {
    //Checks message to determine appropriate action
    if (message == "Turn on") {
        digitalWrite(OUTTAKE_PUMP_SIGNAL, LOW);   // Turn the water pump on (Note that LOW is the voltage level)
        Serial.println("Pump ON");

      } else if (message == "Turn off"){
        digitalWrite(OUTTAKE_PUMP_SIGNAL, HIGH);  // Turn the water pump off by making the voltage HIGH.
        Serial.println("Pump OFF");
      }
  }
 
}
//Method responsible for connecting to the MQTT broker
void reconnect() {
  uint16_t converted_port = static_cast<uint16_t>(port.toInt());//MQTT Port number
  IPAddress ip = IPAddress();
  ip.fromString(broker);//MQTT Broker IP address

  client.setServer(ip, converted_port);//Sets config for MQTT Server
  client.setCallback(callback);//Setsm callback method (method responsible for handling incoming MQTT messages)
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect to mQTT server
    if (client.connect(clientId.c_str(), mqtt_username.c_str(), mqtt_password.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe to topic
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
    //Configures LED light to be on only when connected to MQTT broker
    digitalWrite(BUILTIN_LED, HIGH);
    reconnect();
    digitalWrite(BUILTIN_LED, LOW);
  }
  client.loop();//Keeps code alive and continously listens for MQTT messages.
  delay(1000);
}
