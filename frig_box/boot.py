# This file is executed on every boot (including wake-boot from deepsleep)

#import esp
#esp.osdebug(None)

import webrepl
webrepl.start()

import wifi
wifi.wlan_connect()

import uos
def cat(fn):
    with open(fn,'r') as fh:
        print(''.join(fh.readlines()))

import main
main.Controller()


