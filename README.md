How to deploy product:
- wire all necessary devices using wiring diagrams
- upload code using arduino IDE to respective node MCUs

**Update 12/5/2024:**
VT Testbed:
Testbed code is located in Arduino_VT folder. Each subfolder in that directory is an arduino code for a given NodeMCU or Arduino Wifi 1010 Microcontroller. A diagram of the VT Testbed showing the hardware connections is located in that folder.

Setting up Arduino IDE:
1. Install the following dependencies:
   - esp8266 by ESP8266 Community (Version 3.1.2)
   - Arduino SAMD Boards 32 bits ARM Cortex-M0+) by Arduino (Version 1.8.14)
   - WiFi101 by Arduino (Version 0.16.1)
   - WifiNINA by Arduino (Version 1.8.14)
   - Arduino MqttClient by Arduino (Version 2.5.8)
   - Adafruit MQTT Library by Adafruit (Version 2.5.8)
   - DFRobot_BC20_Gravity by DFRobot (Version 1.0.0)
   - DallasTemperature by Miles Burton (Version 3.9.0)
   - OneWire by Jim Studt (Version 2.3.8)
   - PubSubClient by Nick O'Leary (Version 2.8)
2. Depending on what code you are uploading: Select either NodeMCU 1.0 (ESP-12E Module) or Arduino MKR WiFi 1010 and compile your code.
3. If the compilation is successful then upload it to the device.
4. When booting up the microcontroller for the first time make sure to hit the reset button.
5. For NodeMCU's a Blue LED light should turn on if it can connect to the MQTT Broker.
   
Setting up MQTT Server (Rasberry Pi 5):
Virginia Tech's tesbed using Home Assistant to run a Mosquitto MQTT Broker. 
1. To start it up, turn on the Raspberry Pi (it may take several minutes because it is booting up home assistant as well).
2. Once the desktop screen is loaded. Give it a additional few minutes to process the startup tasks.
3. Then open up Chrome and click on the "Work" User Profile. Then select the Home Assistant Bookmark from the Chome Menu (Should be the first option).
4. Proceed to **Settings -> Devices & Services -> Integrations** and find the MQTT Add on. Click on start to turn on the MQTT Broker. (More information can be found here https://github.com/home-assistant/addons/blob/master/mosquitto/DOCS.md)]
5. MQTT should be up and fully operational.
6. If HomeAssistant does not boot up properly. Please reference the Downloads folder of the Raspberry Pi and locate the file titled "How to reboot" to find instructions on how to restart home assistant.

VR Configuration:
1. Consists of AI Practice, Non AI Practice,  and Intro Scene Scenes.
2. To configure which Practice Scene to load. Locate the "SceneManager" object and find the Level Manager Script Component. Then type in the name of the practice phase.
3. Make sure to set up Convai by entering your Convai API key in the Convai menu located on the top menu bar on unity and click account.
4. VT User Study consisted of 3 Web cameras. Find the code for that in MultiCameraApp.cs Note webcamera order will change so it will need to be reprogrammed according to your needs. Use changeCameraIndex() to change cameras when desired.
