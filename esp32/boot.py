# This file is executed on every boot (including wake-boot from deepsleep)

#import esp
#esp.osdebug(None)

import webrepl
webrepl.start()

import wifi
wifi.wlan_connect()

# import proof_box_main
# proof_box_main.ProofBox()
#
# from keypad import Keypad
# k=Keypad()
# k.start()
#
# from utils import *
# from machine import Pin,PWM
# p=Pin(15,Pin.OUT)
# p.on()
# p.off()
#
# read_config()
# from led_interface import LED_Interface
# led=LED_Interface()
# led.display.write_txt('34.6  56.2')
# led.display.write_flash_txt('34.6  56.2')
#
#
# import machine
# machine.reset()