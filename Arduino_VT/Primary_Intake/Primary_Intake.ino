
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define WATER_LEVEL_SIGNAL A0

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

  pinMode(13, OUTPUT); // Turns on the water pump PIN 13/D7
  
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(13, LOW);
  int value = analogRead(WATER_LEVEL_SIGNAL);
  Serial.print("Water Level Sensor ");
  Serial.println(value);
  delay(10);

}
