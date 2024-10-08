import paho.mqtt.client as mqtt

# Define the MQTT broker details
broker_address = "broker.hivemq.com"  # Example broker address, replace with actual broker
broker_port = 1883
topic = "vr/attackScenario"

# Callback function when a connection to the broker is made
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully")
        # Subscribe to the desired topic
        client.subscribe(topic)
    else:
        print("Connection failed with code", rc)

# Callback function when a message is received from the broker
def on_message(client, userdata, msg):
    payload = msg.payload.decode("utf-8")
    print(f"Message received: {payload}")

    # Perform an action based on the received message
    if payload == "start_attack":
        print("Triggering attack simulation scenario...")
        # You can add your custom function call here
        start_attack_scenario()
    elif payload == "stop_attack":
        print("Stopping attack simulation scenario...")
        # You can add another custom function here
        stop_attack_scenario()
    else:
        print("Unknown message received")

# Define actions
def start_attack_scenario():
    print("Attack scenario started!")

def stop_attack_scenario():
    print("Attack scenario stopped!")

# Setup MQTT client
client = mqtt.Client()

# Bind the callback functions
client.on_connect = on_connect
client.on_message = on_message

# Connect to the broker
client.connect(broker_address, broker_port)

# Blocking loop to process network traffic and handle reconnects
client.loop_forever()
