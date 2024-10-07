//Dependencies
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include <WiFiNINA.h>
#include <PubSubClient.h>

//Connect Arduino Board to WiFi
WiFiClient wifiClient;
HttpClient httpClient(wifiClient, "192.168.8.210", 8080);
//WIFI Information 
const char* ssid = "Testbed-W";
const char* ssid_pass = "HokieDVE";  // Use this variable if you want to connect to WiFi
const char* broker = "192.168.8.210"; 
const char* mqtt_username = "smartmqtt";
const char* mqtt_password = "HokieDVE";
const int mqtt_port = 1883; 
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMqttPublishTimePH = 0;  // To store the time of the last published message
unsigned long lastMqttPublishTimeWater = 0;  // To store the time of the last published message

//MQTT Topics
const char* topic_outtake_pump = "chlo_chamber/outtake_pump";  
const char* topic_ph = "chlo_chamber/ph_sensor";  
const char* topic_level = "chlo_chamber/water_level";  

//Arduino Ports and Pins
#define phSensorPin A0
#define levelSensor A1
#define LED 13
#define pumpPin 0
#define ground 7
#define GND_PIN 2 

//Values for calculating pH level
int samples = 10;
float adc_resolution = 1024.0;

//Converts voltage value to readable pH value
float ph (float voltage) {
    return 7 + ((2.5 - voltage) / 0.1841);
}

void setup() {
  Serial.begin(9600);
  
  Serial.println("Serial initialized");

  /*Connecting to the the Wifi Router*/

  // Connect to Wi-Fi
  WiFi.begin(ssid, ssid_pass); // Use the variable for SSID and password
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  //Configure Arduino Pins
  //Water level needs 5 Volts to work properly
  pinMode(pumpPin, OUTPUT);
  pinMode(ground, OUTPUT);
  digitalWrite(ground, LOW);
  pinMode(GND_PIN, OUTPUT);
  digitalWrite(GND_PIN, LOW); 
  pinMode(LED, OUTPUT);
  //Defaults pump to off
  digitalWrite(pumpPin, HIGH);
  
  // Connects to MQTT Broker
  client.setServer(broker, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  // Continously listens to MQTT
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Readers water level
  int water_level_value = analogRead(levelSensor);

  // Reads pH Sensor value.
  int measurings = 0;
  for (int i = 0; i < samples; i++){
    measurings += analogRead(phSensorPin);
    delay(10);
  }

  // Publish pH level to MQTT every second
  if (millis() - lastMqttPublishTimePH > 1000U) {
    lastMqttPublishTimePH = millis();  // Update the last publish time
    // Calibrates value to desired value
    float voltage = (5.0 / adc_resolution) * (measurings / samples); // Fixing division order
    // Converts voltage to pH Value
    float ph_level_value = ph(voltage);
    String ph_value_str = String(ph_level_value, 2);  // Convert to string and round to 2 decimal places

    // Publishes pH level to MQTT and prints on serial monitor
    client.publish(topic_ph, ph_value_str.c_str());
    Serial.print("PhValue: ");
    Serial.println(ph_value_str);
  }
  delay(1000);
  // Publish water level every 2 seconds
  if (millis() - lastMqttPublishTimeWater > 2000U) { 
    lastMqttPublishTimeWater = millis();  // Update the last publish time
    String water_level_str = String(water_level_value); // Convert water level to string
    // Publishes water level to MQTT and prints on serial monitor
    client.publish(topic_level, water_level_str.c_str());
    Serial.print("Water level: ");
    Serial.println(water_level_str);
  }
}

/*
  Method responsible for connecting to the MQTT Broker
*/
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe
      client.subscribe(topic_outtake_pump);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
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
    message += (char)payload[i]; 
  }
  
  if (strcmp(topic, topic_outtake_pump) == 0) {
    if (message == "Turn on") {
        digitalWrite(pumpPin, LOW);   // Turn the pump on (LOW)
        Serial.println("Pump ON");
    } else if (message == "Turn off") {
        digitalWrite(pumpPin, HIGH);  // Turn the pump off (HIGH)
        Serial.println("Pump OFF");
    }
  }
}
