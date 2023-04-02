/*
# This sample code is used to connect Mqtt based the pH meter V1.0.
# Editor : cybersec lab azab
# Ver : 1.0
# Product: analog pH meter
# SKU : SEN0161
*/
#define SensorPin A0 //pH meter Analog output to Arduino Analog Input 0
#define LED 13
#define SIGNAL_PIN A1
#define pin1 20
#define ground 7

#include <ArduinoMqttClient.h>
#if defined(ARDUINO_SAMD_MKRWIFI1010) || defined(ARDUINO_SAMD_NANO_33_IOT) || defined(ARDUINO_AVR_UNO_WIFI_REV2)
  #include <WiFiNINA.h>
#elif defined(ARDUINO_SAMD_MKR1000)
  #include <WiFi101.h>
#elif defined(ARDUINO_ARCH_ESP8266)
  #include <ESP8266WiFi.h>
#elif defined(ARDUINO_ARCH_ESP32)
  #include <WiFi.h>
#endif

//#include "arduino_secrets.h"
///////please enter your sensitive data in the Secret tab/arduino_secrets.h
char ssid[] = "hydro";    // your network SSID (name)
char pass[] = "hydrohydro";    // your network password (use for WPA, or use as key for WEP)

// To connect with SSL/TLS:
// 1) Change WiFiClient to WiFiSSLClient.
// 2) Change port value from 1883 to 8883.
// 3) Change broker value to a server with a known SSL/TLS root certificate 
//    flashed in the WiFi module.

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "192.168.1.179";
int        port     = 1883;
const char topic_ph[]  = "chlorine/ph";
const char topic_level[] = "chlorine/level";
const char topic_pump[] = "chlorine/pump";
int samples = 10;
float adc_resolution = 1024.0;

float ph (float voltage) {
    return 7 + ((2.5 - voltage) / 0.18);
}

void setup() {
  pinMode(pin1, OUTPUT);
  pinMode(ground, OUTPUT);
  digitalWrite(ground, LOW);

  pinMode(LED,OUTPUT);

  Serial.println("pH meter experiment!"); //Test the serial monitor
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // attempt to connect to WiFi network:
  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();

  // You can provide a unique client ID, if not set the library uses Arduino-millis()
  // Each client must have a unique client ID
  mqttClient.setId("arduino-client-chlorine-ph");

  // You can provide a username and password for authentication
  mqttClient.setUsernamePassword("emqx", "public");

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

  mqttClient.subscribe(topic_pump);
  mqttClient.onMessage(onMqttMessage);
  Serial.print("Subscribed to topic: ");
  Serial.println(topic_pump);
  Serial.println();
}

void loop() {

mqttClient.poll();

int measurings = 0;
int value = analogRead(SIGNAL_PIN);

for (int i = 0; i < samples; i++){
  measurings += analogRead(SensorPin);
  delay(10);
}
  float voltage = 5 / adc_resolution * measurings/samples;

  mqttClient.beginMessage(topic_ph);
  mqttClient.print("pHValue is:");
  mqttClient.print(voltage,2);
  mqttClient.endMessage();

  Serial.print("PhValue :" );
  Serial.print(voltage);
  Serial.println();

  mqttClient.beginMessage(topic_level);
  mqttClient.print("water level is:");
  mqttClient.print(value,2);
  mqttClient.endMessage();

  Serial.print("Water lvl :" );
  Serial.print(value);
  Serial.println();
/*
  Serial.println("Setting to LOW");
  digitalWrite(pin1, LOW);

  delay(5000);
    
  Serial.println("Setting to HIGH");
  digitalWrite(pin1, HIGH);
      
  delay(5000);
*/
  delay(1000);
}

void onMqttMessage(int messageSize){

  Serial.println("--------------------------");
  Serial.print("Received a message with topic '");
  Serial.println(mqttClient.messageTopic());

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

  if (strcmp(messageArr,"off") == 0) { 
    digitalWrite(pin1, LOW);    
  }   

  if (strcmp(messageArr,"on") == 0) {
    digitalWrite(pin1, HIGH);
  }

}

