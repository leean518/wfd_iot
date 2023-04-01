File: tdsAndPump

topic - grit/pump
topic - grit/tds

broker - 192.168.1.179

Usage - both the water pump and tds sensors are on this MCU
-pump is subscribed to and can take commands from grit/pump (on/off)
-tds sensor publishes readings to grit/tds

////////////////////////////////////

File: waterLevel

topic - grit/level

broker - 192.168.1.179

Usage - water level sensor publsihes water level readings for the grit chamber to grit/level
