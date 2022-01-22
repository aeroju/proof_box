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

# import main
# main.Controller().run()

# import measure_and_sleep
# measure_and_sleep.Main().run()


# import dht
# from machine import PWM,Pin,SPI
# import max7219
# import _thread
# import utime
#
# up_sensor=13
# low_sensor=14
#
# fan=26
#
# sck=18
# mosi=19
# cs=23
#
# spi=SPI(1,baudrate=10000000, polarity=1, phase=0,
#         sck=Pin(sck),
#         mosi=Pin(mosi))
# ss = Pin(cs)
# display=max7219.Matrix8x8(spi,ss,8)
# display.init2()
# display.text('12345678',0,0,1)
# display.show()
