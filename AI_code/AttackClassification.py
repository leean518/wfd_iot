import os
from urllib import response
import openai
import paho.mqtt.client as mqtt
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
#from langchain.chat_models import ChatOpenAI
openai.api_key = "USE-OWN-API-KEY"
llm_model = "gpt-4"


message = ""

def lang_classification ():
    #print(rec)
    llm_model = "gpt-4"
    {
    "attack_class_fdt": False,
    "attack_class_dos": False,
    "attack_class_phsh": False,
    }


    #if(rec): 
        #print ("Inline Classification: ", message)
    
    
    #high_level_attack_description = """ message """
    high_level_attack_description = message
    
    attack_template = """\
    For the following text, extract the following information:

    attack_class_fdt: Does the description suggest innacurate meter readings caused by potential manipulation? \
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
    #print(prompt_template)
    messages = prompt_template.format_messages(text=high_level_attack_description)
    chat = ChatOpenAI(temperature=0.0, model=llm_model, openai_api_key="USE-OWN-API-KEY")
    response = chat(messages)
    print(response.content)


    
    #The network speed at the water treatment facility has been slowing \
    #down immensely. It seems there is too much traffic coming from \
    #various unknown sources."""
 
 
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
    
    
client = mqtt.Client()

client.on_connect = on_connect
client.on_message = on_message

client.connect("broker.hivemq.com", 1883)

client.subscribe("attackMessage")

client.loop_start()



#if(rec):
    #lang_classification(message)


while True: 
    #lang_classification()
    if(rec):
        lang_classification ()
        rec = False
        #print(1)

