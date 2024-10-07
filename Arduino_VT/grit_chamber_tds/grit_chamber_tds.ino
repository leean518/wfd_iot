// Original source code: https://wiki.keyestudio.com/KS0429_keyestudio_TDS_Meter_V1.0#Test_Code
// Project details: https://RandomNerdTutorials.com/esp8266-nodemcu-tds-water-quality-sensor/
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_ADS1X15.h>

Adafruit_ADS1115 ads1115;	// Construct an ads1115 

#define TdsSensorPin A0
#define VREF 3.3              // analog reference voltage(Volt) of the ADC
#define SCOUNT  30            // sum of sample point
#define OUTTAKE_PUMP_SIGNAL 12
//WIFI Information 
const char* ssid = "Testbed-W";
const char* ssid_pass = "HokieDVE";
String broker = "192.168.8.210"; 
String mqtt_username = "smartmqtt";
String mqtt_password = "HokieDVE";
String port = "1883"; 
WiFiClient espClient;
PubSubClient client(espClient);
//Node information 
String topic_outtake_pump = "grit_chamber/outtake_pump";  

int analogBuffer[SCOUNT];     // store the analog value in the array, read from ADC
int analogBufferTemp[SCOUNT];
int analogBufferIndex = 0;
int copyIndex = 0;

float averageVoltage = 0;
float tdsValue = 0;
float temperature = 23;       // current temperature for compensation
unsigned long lastMqttPublishTime = 0;  // To store the time of the last published message
// https://randomnerdtutorials.com/esp8266-nodemcu-tds-water-quality-sensor/#demonstration
// median filtering algorithm
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

void setup(){
  Serial.begin(115200);
  pinMode(TdsSensorPin,INPUT);
  pinMode(OUTTAKE_PUMP_SIGNAL, OUTPUT); // Turns on the water pump PIN 12/D6
  digitalWrite(OUTTAKE_PUMP_SIGNAL, HIGH);
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  digitalWrite(BUILTIN_LED, LOW);
  delay(1000);

  //WiFI Setup
  WiFi.begin(ssid, ssid_pass);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");

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

void loop(){

  if (!client.connected()) {
    digitalWrite(BUILTIN_LED, HIGH);
    reconnect();
    digitalWrite(BUILTIN_LED, LOW);
  }
  client.loop();
  //ADC Water Level Code
  //int16_t adc0;
  float volts0;
  //adc0 = ads1115.readADC_SingleEnded(0);
  //Serial.print("Water Level: ");
  //volts0 = ads1115.computeVolts(adc0);
  // https://lastminuteengineers.com/water-level-sensor-arduino-tutorial/
  //Serial.print("Water Level Sensor Value: ");
  //Serial.println(volts0);

  //TDS Meter
  static unsigned long analogSampleTimepoint = millis();
  if(millis()-analogSampleTimepoint > 40U){     //every 40 milliseconds,read the analog value from the ADC
    analogSampleTimepoint = millis();
    analogBuffer[analogBufferIndex] = analogRead(TdsSensorPin);    //read the analog value and store into the buffer
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
      
      // read the analog value more stable by the median filtering algorithm, and convert to voltage value
      averageVoltage = getMedianNum(analogBufferTemp,SCOUNT) * (float)VREF / 1024.0;
      
      //temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0)); 
      float compensationCoefficient = 1.0+0.02*(temperature-25.0);
      //temperature compensation
      float compensationVoltage=averageVoltage/compensationCoefficient;
      
      //convert voltage value to tds value
      tdsValue=(133.42*compensationVoltage*compensationVoltage*compensationVoltage - 255.86*compensationVoltage*compensationVoltage + 857.39*compensationVoltage)*0.5;
      
       if (millis() - lastMqttPublishTime > 1000U) { //Published MQTT message every one second
          lastMqttPublishTime = millis();  // Update the last publish time
          Serial.print("TDS Value:");
          Serial.print(tdsValue,0);
          Serial.println("ppm");
          String tds_value = String(tdsValue);
          client.publish("grit_chamber/tds", tds_value.c_str());
       }
        
    }
  }

}
