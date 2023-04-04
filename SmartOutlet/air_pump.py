import asyncio
import asyncio_mqtt as aiomqtt
import paho.mqtt as mqtt
from kasa import SmartPlug

aiomqtt.Client(
    hostname="192.186.1.179",  # The only non-optional parameter
    port=1883,
    username=None,
    password=None,
    logger=None,
    client_id=None,
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
    dev = SmartPlug("192.168.1.147")
    async with aiomqtt.Client("192.168.1.179") as client:
        async with client.messages() as messages:
            await client.subscribe("primary/plug/air")
            async for message in messages:
                signal = str(message.payload.decode("utf-8"))
                print(signal)
                if signal == "on":
                    await dev.turn_on()
                elif signal == "off":
                    await dev.turn_off()


asyncio.run(main())
