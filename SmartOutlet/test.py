import asyncio
from kasa import SmartPlug

async def main():
    p = SmartPlug("192.168.68.112")

    await p.update()  # Request the update
    print(p.alias)  # Print out the alias
    print(p.emeter_realtime)  # Print out current emeter status

    await p.turn_off()  # Turn the device off

if __name__ == "__main__":
    asyncio.run(main())