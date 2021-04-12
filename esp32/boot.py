# This file is executed on every boot (including wake-boot from deepsleep)

#import esp
#esp.osdebug(None)

import webrepl
webrepl.start()

import wifi
wifi.wlan_connect()

import ntptime,utime
ntptime.host = 'cn.pool.ntp.org'
ntptime.NTP_DELTA -=8*60*60

for _ in range(15):
    try:
        ntptime.settime()
        break
    except:
        utime.sleep(1)

import machine
import gc
gc.collect()
import main
main.ProofBox()

