import paho.mqtt.client as mqtt
import subprocess
import os
import signal  # Needed to terminate processes

# MQTT broker details
broker_address = "192.168.8.210"
broker_port = 1883
topic = "vr/attackScenario"
username = "smartmqtt"
password = "HokieDVE"
attackScenario = None  # Global variable to track the process

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully")
        # Subscribe to the desired topic
        client.subscribe(topic)
    else:
        print("Connection failed with code", rc)

# Executes appropriate attack based on message
def on_message(client, userdata, msg):
    payload = msg.payload.decode("utf-8")

    # Executes Scenario 1
    if payload == "start_attack_1":
        print("Triggering attack simulation scenario...")
        start_attack_scenario1()
    elif payload == "stop_attack_1":
        print("Stopping attack simulation scenario...")
        stop_attack_scenario1()
        print("Stopped Scenario 1!")
    elif payload == "start_attack_2":
        print("Triggering attack simulation scenario...")
        start_attack_scenario2()
    elif payload == "stop_attack_2":
        print("Stopping attack simulation scenario...")
        stop_attack_scenario2()
        print("Stopped Scenario 2!")
    elif payload == "start_attack_3":
        print("Triggering attack simulation scenario...")
        start_attack_scenario3()
    elif payload == "stop_attack_3":
        print("Stopping attack simulation scenario...")
        stop_attack_scenario3()
        print("Stopped Scenario 3!")
    elif payload == "start_attack_4":
        print("Triggering attack simulation scenario...")
        start_attack_scenario4()
    elif payload == "stop_attack_4":
        print("Stopping attack simulation scenario...")
        stop_attack_scenario4()
        print("Stopped Scenario 4!")
    elif payload == "start_attack_5":
        print("Triggering attack simulation scenario...")
        start_attack_scenario5()
    elif payload == "stop_attack_5":
        print("Stopping attack simulation scenario...")
        stop_attack_scenario5()
        print("Stopped Scenario 5!")
    else:
        print("Unknown message received")

# Scenario 1 helper functions
def start_attack_scenario1():
    global attackScenario  # Declare attackScenario as global so it can be modified
    if attackScenario is None:
        print("Running Scenario 1!")
        attackScenario = subprocess.Popen(["sudo", "python", "Scenario1_Attack.py"])
    else:
        print("Scenario 1 is already running!")

def stop_attack_scenario1():
    global attackScenario  # Declare attackScenario as global to access it
    if attackScenario is not None:
        os.kill(attackScenario.pid, signal.SIGTERM)  # Terminate the process
        print("Stopped Scenario 1!")
        attackScenario = None  # Reset the variable after stopping
    else:
        print("No attack scenario running.")

# Scenario 2 helper functions
def start_attack_scenario2():
    global attackScenario  # Declare attackScenario as global so it can be modified
    if attackScenario is None:
        print("Running Scenario 2!")
        attackScenario = subprocess.Popen(["sudo", "python", "Scenario2_Attack.py"])
    else:
        print("Scenario 2 is already running!")

def stop_attack_scenario2():
    global attackScenario  # Declare attackScenario as global to access it
    if attackScenario is not None:
        os.kill(attackScenario.pid, signal.SIGTERM)  # Terminate the process
        print("Stopped Scenario 2!")
        attackScenario = None  # Reset the variable after stopping
    else:
        print("No attack scenario running.")

# Scenario 3 helper functions
def start_attack_scenario3():
    global attackScenario  # Declare attackScenario as global so it can be modified
    if attackScenario is None:
        print("Running Scenario 3!")
        attackScenario = subprocess.Popen(["sudo", "python", "Scenario3_Attack.py"])
    else:
        print("Scenario 3 is already running!")

def stop_attack_scenario3():
    global attackScenario  # Declare attackScenario as global to access it
    if attackScenario is not None:
        os.kill(attackScenario.pid, signal.SIGTERM)  # Terminate the process
        print("Stopped Scenario 3!")
        attackScenario = None  # Reset the variable after stopping
    else:
        print("No attack scenario running.")

# Scenario 4 helper functions
def start_attack_scenario4():
    global attackScenario  # Declare attackScenario as global so it can be modified
    if attackScenario is None:
        print("Running Scenario 4!")
        attackScenario = subprocess.Popen(["sudo", "python", "Scenario4_Attack.py"])
    else:
        print("Scenario 4 is already running!")

def stop_attack_scenario4():
    global attackScenario  # Declare attackScenario as global to access it
    if attackScenario is not None:
        os.kill(attackScenario.pid, signal.SIGTERM)  # Terminate the process
        print("Stopped Scenario 4!")
        attackScenario = None  # Reset the variable after stopping
    else:
        print("No attack scenario running.")

# Scenario 5 helper functions
def start_attack_scenario5():
    global attackScenario  # Declare attackScenario as global so it can be modified
    if attackScenario is None:
        print("Running Scenario 5!")
        attackScenario = subprocess.Popen(["sudo", "python", "Scenario5_Attack.py"])
    else:
        print("Scenario 5 is already running!")

def stop_attack_scenario5():
    global attackScenario  # Declare attackScenario as global to access it
    if attackScenario is not None:
        os.kill(attackScenario.pid, signal.SIGTERM)  # Terminate the process
        print("Stopped Scenario 5!")
        attackScenario = None  # Reset the variable after stopping
    else:
        print("No attack scenario running.")

# Setup MQTT client
client = mqtt.Client()
client.username_pw_set(username, password)
# Bind the callback functions
client.on_connect = on_connect
client.on_message = on_message

# Connect to the broker
client.connect(broker_address, broker_port)

# Blocking loop to process network traffic and handle reconnects
client.loop_forever()
