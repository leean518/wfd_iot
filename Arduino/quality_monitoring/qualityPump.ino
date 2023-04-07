#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define pin1 13

// WiFi
const char *ssid = "hydro"; // Enter your WiFi name
const char *password = "hydrohydro";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.1.179";
const char *topic = "quality/pump";
const char *mqtt_username = "emqx";
const char *mqtt_password = "public";
const int mqtt_port = 1883;
int *level;

WiFiClient espClient;
PubSubClient client(espClient);
void setup() {
  pinMode(pin1, OUTPUT);
  Serial.begin(115200);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  while (!client.connected()) {
      const char *client_id = "esp8266-client-qaulity-pump";
      Serial.println("Connecting to public emqx mqtt broker.....");
    if (client.connect(client_id)) {
      Serial.println("Public emqx mqtt broker connected");
    } 
    else {
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
  // publish and subscribe
  client.publish(topic, "hello emqx");
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
        Serial.println("\nTurning on");
      }   // LED on
      if (message == "off") {
        Serial.println("\nTurning off");
        digitalWrite(pin1, LOW); 
      }
    }

    Serial.println();
    Serial.println("-----------------------");
}

void loop() {
    client.loop();
}
