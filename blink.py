from machine import Pin
from time import sleep
import network
import tkinter
import urllib.request

main_url="http://192.168.43,141"
window=Tkinter.Tk()
window.title("ESP8266 with Python")
def sendRequest(url):
    a = urllib.request.urlopen(url)
def ledon():
    sendRequest(main_url+"/ledon")
def ledoff():
    sendRequest(main_url+"/ledoff")
    
while True:
    headline=tkinter.Label(window, text="Led Control with python TKinter(ESP8266", fg="red", font=("ANUDAW",25))
    headline.grid(column=2, row=0)
    ON=tkinter.Button(window,text="ON",command=ledon,fg="yellow", bg="green", font=("Lobster 1.4",25))
    ON.grid(column=2, row=1)
    OFF=tkinter.Button(window,text="OFF",command=ledoff,fg="yellow", bg="green", font=("Lobster 1.4",25))
    ON.grid(column=2, row=2)
    window.mainloop()
    


def do_connect():
    import network
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('connecting to network...')
        sta_if.active(True)
        sta_if.connect('hydro', 'hydrohydro')
        while not sta_if.isconnected():
            pass
    print('network config:', sta_if.ifconfig())

do_connect()

black = Pin(4, Pin.OUT)
red = Pin(5, Pin.OUT)


while True:
    black.value(1)
    red.value(0)
    sleep(2)
    black.value(0)
    red.value(1)
    sleep(2)

