//Dependencies
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include <WiFiNINA.h>
#include <ArduinoMqttClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

//Connect Arduino Board to WiFi
WiFiClient wifiClient;
HttpClient httpClient = HttpClient(wifiClient, "192.168.8.210", 8080);
MqttClient mqttClient(wifiClient);
//MQTT Broker Information
const char broker[] = "192.168.8.210"; 
String mqtt_username = "smartmqtt";
String mqtt_password = "HokieDVE";
int port = 1883; 
//MQTT Topics
String topic_outtake_pump = String("quality_monitoring/outtake_pump");  
String topic_ph = String("quality_monitoring/ph_sensor");  
String topic_level = String("quality_monitoring/water_level");  
String topic_temp = String("quality_monitoring/water_temp");  

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

//FOR TEMP SENSOR
const int oneWireBus = 13;          
// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);
// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);
// Temperature value
float temp;

//Converts voltage value to readable pH value
float ph (float voltage) {
    return 7 + ((2.5 - voltage) / 0.1841);
}

void setup() {
  Serial.begin(9600);
  
  Serial.println("Serial initialized");

  /*Connecting to the the Wifi Router*/

  // Connect to Wi-Fi
  WiFi.begin("Testbed-W", "HokieDVE");
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
  //Connects to MQTT Broker
  mqttConn();
}

void loop() {
  //Continously listens to MQTT
  mqttClient.poll();

  //Readers water level
  int water_level_value = analogRead(levelSensor);

  //Gets water temperature value
  sensors.requestTemperatures(); 
  // Temperature in Fahrenheit degrees
  temp = sensors.getTempFByIndex(0);  

  //Reads ph Sensor value.
  int measurings = 0;
  for (int i = 0; i < samples; i++){
    measurings += analogRead(phSensorPin);
    delay(10);
  }
  //Calibrates value to desired value
  float voltage = (5 / adc_resolution) * (measurings/samples);
  //Converts voltage to pH Value
  float ph_level_value = ph(voltage);

  //Publishes pH level to MQTT and prints on serial monitor
  mqttClient.beginMessage(topic_ph);
  mqttClient.print(ph_level_value, 2);
  mqttClient.endMessage();
  // Pure Lemon Juice pH level around -6.55 and window cleaner is around 4.06 (takes time to increase to this value) with current calibration.
  Serial.print("PhValue :" );
  Serial.print(ph_level_value);
  Serial.println();

//Publishes water level to MQTT and prints on serial monitor
  mqttClient.beginMessage(topic_level);
  mqttClient.print(water_level_value);
  mqttClient.endMessage();

  Serial.print("Water lvl :" );
  Serial.print(water_level_value);
  Serial.println();

  delay(1000);
  
}

/*
  Method responsible for connecting to the MQTT Broker
*/
void mqttConn(){
  
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);
  mqttClient.setUsernamePassword(mqtt_username, mqtt_password);
  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

  // set the message receive callback
  mqttClient.onMessage(onMqttMessage);

  Serial.print("Subscribing to topic: ");
  Serial.println(topic_outtake_pump);
  Serial.println();

  // subscribe to a pump topic
  mqttClient.subscribe(topic_outtake_pump);

  // topics can be unsubscribed using:
  // mqttClient.unsubscribe(topic);

  Serial.print("Waiting for messages on topic: ");
  Serial.println(topic_outtake_pump);
  Serial.println();
}

/*
  Method that processes incoming MQTT message requests
*/
void onMqttMessage(int messageSize){
  String message = mqttClient.messageTopic();
  /*
  Serial.println("--------------------------");
  Serial.print("Received a message with topic ");
  Serial.println(message);
  */
  char messageArr[messageSize + 1] ;
  int count = 0; 
  while (mqttClient.available()) {
    char letter = mqttClient.read();  
    messageArr[count] = letter;
    count++;
  }
  messageArr[count] = '\0';
  /*
  Serial.print("Message: ");
  Serial.println(messageArr);
  Serial.println("--------------------------");

  Serial.println(message); Serial.println(topic_outtake_pump);
  */

// Turns pump on or off
  if(message == topic_outtake_pump){

    if (strcmp(messageArr,"Turn off") == 0) { 
      Serial.println("Turning Pump off");
      digitalWrite(pumpPin, HIGH);    
    }   
    if (strcmp(messageArr,"Turn on") == 0) {
      Serial.println("Turning Pump On");
      digitalWrite(pumpPin, LOW);
    }
  }
  
}

