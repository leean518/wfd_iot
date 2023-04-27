import asyncio
import asyncio_mqtt as aiomqtt
import paho.mqtt as mqtt
from kasa import SmartPlug
from kasa import SmartStrip
import requests

# get global variables
global_url = "http://192.168.1.179:8080/api/collections/global/records/r1en4aa61ndcg6y"
response = requests.get(global_url)
global_vars = response.json()
#print(global_vars)

# get heater variables
heater_url = "http://192.168.1.179:8080/api/collections/topics/records/quality_heater_"
response = requests.get(heater_url)
heater_vars = response.json()
#print(heater_vars)

# get bubbler variables
bubbler_url = "http://192.168.1.179:8080/api/collections/topics/records/quality_bubbler"
response = requests.get(bubbler_url)
bubbler_vars = response.json()
#print(bubbler_vars)

# get chlorine mixer variables
mixer_url = "http://192.168.1.179:8080/api/collections/topics/records/chlorine_mixer_"
response = requests.get(mixer_url)
mixer_vars = response.json()
#print(mixer_vars)

# get dechlorine mixer variables
d_mixer_url = "http://192.168.1.179:8080/api/collections/topics/records/dechlorineMixer"
response = requests.get(d_mixer_url)
d_mixer_vars = response.json()
#print(d_mixer_vars)


aiomqtt.Client(
    hostname=global_vars['broker'],  # The only non-optional parameter
    port=global_vars['port'],
    username=global_vars['username'],
    password=global_vars['password'],
    logger=None,
    client_id="pi-intake-air-pump",
    tls_context=None,
    tls_params=None,
    proxy=None,
    protocol=None,
    will=None,
    clean_session=None,
    transport="tcp",
    keepalive=60,
    bind_address="",
    bind_port=0,
    clean_start=mqtt.client.MQTT_CLEAN_START_FIRST_ONLY,
    properties=None,
    message_retry_set=20,
    socket_options=(),
    max_concurrent_outgoing_calls=None,
    websocket_path=None,
    websocket_headers=None,
)

async def main():
    strip = SmartStrip("192.168.1.193")
    await strip.update()
    for plug in strip.children:
        print(f"{plug.alias}: {plug.is_on}")
        
    print(f"Found {strip} with {len(strip.children)} children")
    heater = strip.children[0]
    bubbler = strip.children[1]
    agitator = strip.children[2]
    
    async with aiomqtt.Client(global_vars['broker']) as client:
        async with client.messages() as messages:
            await client.subscribe("#")
            async for message in messages:
            
               if message.topic.matches(bubbler_vars['topic']):
                    signal = str(message.payload.decode("utf-8"))
                    print(bubbler_vars['topic'],": {signal}")
                    if signal == "on":
                        await bubbler.turn_on()
                    elif signal == "off":
                        await bubbler.turn_off()
                    
               if message.topic.matches(heater_vars['topic']):
                    signal = str(message.payload.decode("utf-8"))
                    print(heater_vars['topic'],": {signal}")
               
                    if signal == "on":
                        await heater.turn_on()
                    elif signal == "off":
                        await heater.turn_off()

               if message.topic.matches(mixer_vars['topic']):
                    signal = str(message.payload.decode("utf-8"))
                    print(mixer_vars['topic'],": {signal}")
               
                    if signal == "on":
                        await agitator.turn_on()
                    elif signal == "off":
                        await agitator.turn_off()
            
                  
asyncio.run(main())
