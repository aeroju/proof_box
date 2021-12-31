# This file is executed on every boot (including wake-boot from deepsleep)

#import esp
#esp.osdebug(None)

import webrepl
webrepl.start()

import wifi
wifi.wlan_connect()

# import proof_box_main
# proof_box_main.ProofBox()

