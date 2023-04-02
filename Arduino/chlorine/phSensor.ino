/*
# This sample code is used to connect Mqtt based the pH meter V1.0.
# Editor : cybersec lab azab
# Ver : 1.0
# Product: analog pH meter
# SKU : SEN0161
*/
#define SensorPin A0 //pH meter Analog output to Arduino Analog Input 0
#define Offset 0.00 //deviation compensate
#define LED 13
#define samplingInterval 20
#define printInterval 800
#define ArrayLenth 40 //times of collection
int pHArray[ArrayLenth]; //Store the average value of the sensor feedback
int pHArrayIndex=0;

#define SIGNAL_PIN A1
int value = 0;
//#define POWER_PIN 

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
const long interval = 1000;
unsigned long previousMillis = 0;

int count = 0;

void setup() {
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
}

void loop() {
  static unsigned long samplingTime = millis();
  static unsigned long printTime = millis();
  static float pHValue,voltage;


  // call poll() regularly to allow the library to send MQTT keep alives which
  // avoids being disconnected by the broker
  mqttClient.poll();

  // to avoid having delays in loop, we'll use the strategy from BlinkWithoutDelay
  // see: File -> Examples -> 02.Digital -> BlinkWithoutDelay for more info
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    // save the last time a message was sent
    previousMillis = currentMillis;

    Serial.println();

          if(millis()-samplingTime > samplingInterval)
          {
              pHArray[pHArrayIndex++]=analogRead(SensorPin);
              if(pHArrayIndex==ArrayLenth)pHArrayIndex=0;
              voltage = avergearray(pHArray, ArrayLenth)*5.0/1024;
              pHValue = 3.5*voltage+Offset;
              samplingTime=millis();
          }
          if(millis()-printTime > printInterval) //Every 800 milliseconds, print a numerical, convert the state of the LED indicator
          {
              //Serial.print("Voltage:  ");
             // Serial.print(voltage,2);
              Serial.print("  pH value: ");
              Serial.println(pHValue,2);
              digitalWrite(LED,digitalRead(LED)^1);
              printTime=millis();

              Serial.print("Sending message to topic: ");
              Serial.println(topic_ph);
          
              Serial.print("water level: ");
              value = analogRead(SIGNAL_PIN);
              Serial.println(value );              

              // send message, the Print interface can be used to set the message contents
              mqttClient.beginMessage(topic_ph);
              mqttClient.print("pHValue is:");
              mqttClient.print(pHValue,2);
              mqttClient.endMessage();

              mqttClient.beginMessage(topic_level);
              mqttClient.print("water level is:");
              mqttClient.print(value,2);
              mqttClient.endMessage();

       }
  }
}

double avergearray(int* arr, int number){
int i;
int max,min;
double avg;
long amount=0;
if(number<=0){
Serial.println("Error number for the array to avraging!/n");
return 0;
}
if(number<5){ //less than 5, calculated directly statistics
for(i=0;i<number;i++){
amount+=arr[i];
}
avg = amount/number;
return avg;
}else{
if(arr[0]<arr[1]){
min = arr[0];max=arr[1];
}
else{
min=arr[1];max=arr[0];
}
for(i=2;i<number;i++){
if(arr[i]<min){
amount+=min; //arr<min
min=arr[i];
}else {
if(arr[i]>max){
amount+=max; //arr>max
max=arr[i];
}else{
amount+=arr[i]; //min<=arr<=max
}
}//if
}//for
avg = (double)amount/(number-2);
}//if
return avg;
}
