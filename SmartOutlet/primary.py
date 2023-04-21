import asyncio
import asyncio_mqtt as aiomqtt
import paho.mqtt as mqtt
from kasa import SmartPlug
from kasa import SmartStrip

aiomqtt.Client(
    hostname="192.186.1.179",  # The only non-optional parameter
    port=1883,
    username=None,
    password=None,
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

    for plug in strip.children:
        print(f"{plug.alias}: {plug.is_on}")
    
    async with aiomqtt.Client("192.168.1.179") as client:
        async with client.messages() as messages:
            await client.subscribe("#")
            async for message in messages:
            
               if message.topic.matches("primary/plug/air"):
                    signal = str(message.payload.decode("utf-8"))
                    print(f"primary/pump/air: {signal}")
                    if signal == "on":
                        await bubbler.turn_on()
                    elif signal == "off":
                        await bubbler.turn_off()
                    
               if message.topic.matches("primary/plug/heater"):
                    signal = str(message.payload.decode("utf-8"))
                    print(f"primary/pump/heater: {signal}")
               
                    if signal == "on":
                        await heater.turn_on()
                    elif signal == "off":
                        await heater.turn_off()

               if message.topic.matches("primary/plug/agitator"):
                    signal = str(message.payload.decode("utf-8"))
                    print(f"primary/pump/heater: {signal}")
               
                    if signal == "on":
                        await agitator.turn_on()
                    elif signal == "off":
                        await agitator.turn_off()
            
                  
asyncio.run(main())
