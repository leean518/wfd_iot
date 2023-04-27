#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// GPIO 5 D1
#define pin1 13
#define testpin 2
#define levelPin A0
int value = 0;

// WiFi
const char *ssid = "hydro"; // Enter your WiFi name
const char *password = "hydrohydro";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.1.179";
const char *topic = "quality/pump";
const char *levelTopic = "quality/level";
const char *tempTopic = "quality/temp";
const char *mqtt_username = "emqx";
const char *mqtt_password = "public";
const int mqtt_port = 1883;

//FOR TEMP SENSOR
const int oneWireBus = 13;          
// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);
// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);
// Temperature value
float temp;

unsigned long previousMillis = 0;   // Stores last time temperature was published
const long interval = 10000;        // Interval at which to publish sensor readings

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    pinMode(pin1, OUTPUT);
    pinMode(testpin, OUTPUT);
    // Set software serial baud to 115200;
    Serial.begin(115200);
    // connecting to a WiFi network
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the WiFi network");
    //connecting to a mqtt broker
    client.setServer(mqtt_broker, mqtt_port);
    client.setCallback(callback);
    while (!client.connected()) {
        const char *client_id = "esp8266-client-";
        Serial.println("Connecting to public emqx mqtt broker.....");
        if (client.connect(client_id)) {
            Serial.println("Public emqx mqtt broker connected");
        } else {
            Serial.print("failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
  client.subscribe(topic);
}

void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    String message;
    for (int i = 0; i < length; i++) {
        message = message + (char) payload[i];  // convert *byte to string
    }
    Serial.print(message);
    
    if (strcmp(topic,"quality/pump")==0) {
      if (message == "on") { 
        digitalWrite(pin1, HIGH);
        digitalWrite(testpin, HIGH);
      }   // LED on
      if (message == "off") {
        digitalWrite(pin1, LOW);
        digitalWrite(testpin, LOW); 
      }
    }

    Serial.println();
    Serial.println("-----------------------");
}

void checkMQTT(){
  while (!client.connected()) {
        const char *client_id = "esp8266-client-quality";
        Serial.println("Connecting to public emqx mqtt broker.....");
        if (client.connect(client_id)) {
            Serial.println("Public emqx mqtt broker connected");
        } else {
            Serial.print("failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
}

void loop() {
  delay(10);                      // wait 10 milliseconds
  value = analogRead(levelPin); // read the analog value from sensor

  unsigned long currentMillis = millis();
  // Every X number of seconds (interval = 10 seconds) 
  // it publishes a new MQTT message
  if (currentMillis - previousMillis >= interval) {
    // Save the last time a new reading was published
    previousMillis = currentMillis;
    // New temperature readings
    sensors.requestTemperatures(); 
    // Temperature in Fahrenheit degrees
    temp = sensors.getTempFByIndex(0);  

  Serial.print("Water Level: ");
  Serial.println(value);


  Serial.print("Water Temp: ");
  Serial.println(temp);

  Serial.println("------------------------- ");

  char lvl[20];
  sprintf(lvl, "%d",value);

  int tempInt = static_cast<int>(temp);
  char tmp[20];
  sprintf(tmp, "%d",tempInt);


  client.publish(levelTopic, lvl);
  client.publish(tempTopic, tmp);
  Serial.println("Published to mqtt");

  client.loop();

  checkMQTT();
  delay(5000);
  }
}
