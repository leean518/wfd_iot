#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// GPIO 5 D1
#define pin1 5
#define pin2 16
#define pumpPin 13
#define testpin 2
#define levelPin A0

int value = 0; // variable to store the sensor value

// WiFi
const char *ssid = "hydro"; // Enter your WiFi name
const char *password = "hydrohydro";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.1.179";
const char *topic = "primary/#";
const char *levelTopic = "primary/level";
const char *mqtt_username = "emqx";
const char *mqtt_password = "public";
const int mqtt_port = 1883;
int *level;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    Serial.begin(115200);  // Set software serial baud to 115200;

    pinMode(pin1, OUTPUT);
    pinMode(pin2, OUTPUT);
    pinMode(pumpPin, OUTPUT);
    pinMode(testpin, OUTPUT);
    pinMode(levelPin, INPUT);
    
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
        const char *client_id = "esp8266-client-level-pump-primary";
        Serial.println("Connecting to public emqx mqtt broker.....");
        if (client.connect(client_id)) {
            Serial.println("Public emqx mqtt broker connected");
        } else {
            Serial.print("failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
    // publish and subscribe
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

    if (strcmp(topic,"primary/scraper")==0) {
      if (message == "left") { 
        digitalWrite(pin1, LOW);
        digitalWrite(pin2, HIGH);
        digitalWrite(testpin, LOW);
      }  
      if (message == "right") {
        digitalWrite(pin1, HIGH);
        digitalWrite(pin2, LOW);
        digitalWrite(testpin, LOW); 
      }
      if (message =="off") {
        digitalWrite(pin1, HIGH);
        digitalWrite(pin2, HIGH);
        digitalWrite(testpin, HIGH); 
      }
    }
    if (strcmp(topic,"primary/pump")==0) {
      if (message == "on") { 
        digitalWrite(pumpPin, LOW);
        digitalWrite(testpin, LOW);
      }
      if (message == "off") {
        digitalWrite(pumpPin, HIGH);
        digitalWrite(testpin, HIGH); 
      }
    }

    Serial.println();
    Serial.println("-----------------------");
}

void checkMQTT(){
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
}

void loop() {

  delay(10);                      // wait 10 milliseconds
  value = analogRead(levelPin); // read the analog value from sensor

  Serial.print("Water Level: ");
  Serial.println(value);

  Serial.println("------------------------- ");

      char str[20];
      sprintf(str, "%d",value);

  client.publish(levelTopic, str);
  Serial.println("Published to mqtt");

  client.loop();

  checkMQTT();
  delay(1000);
}
