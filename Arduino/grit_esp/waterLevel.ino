
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#define SIGNAL_PIN A0
#define testpin 2
#define pin1 13

int value = 0; // variable to store the sensor value

// WiFi
const char *ssid = "hydro"; // Enter your WiFi name
const char *password = "hydrohydro";  // Enter WiFi password

// MQTT Broker
const char *mqtt_broker = "192.168.1.179";
const char *topic = "grit/level";
const char *mqtt_username = "emqx";
const char *mqtt_password = "public";
const int mqtt_port = 1883;
int *level;

WiFiClient espClient;
PubSubClient client(espClient);


void setup() {
  Serial.begin(115200);
  pinMode(SIGNAL_PIN, INPUT);   

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
        const char *client_id = "esp8266-client-waterLevel-grit";
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

void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    String message;
    for (int i = 0; i < length; i++) {
        message = message + (char) payload[i];  // convert *byte to string
    }
    Serial.print(message);

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
  
  delay(2000);                      // wait 10 milliseconds
  value = analogRead(SIGNAL_PIN); // read the analog value from sensor

  Serial.print("Sensor value: ");
  Serial.println(value);

  Serial.println("------------------------- ");

      char str[20];
      sprintf(str, "%d", value);

  client.publish(topic, str);
  Serial.printf("Published %s to %s\n", str, topic);
  client.loop();
 // checkMQTT();
}
