# This file is executed on every boot (including wake-boot from deepsleep)

#import esp
#esp.osdebug(None)

import webrepl
webrepl.start()

import wifi
if(wifi.wlan_connect('maotouying','1212345678')):
    import ntptime,utime
    ntptime.host = 'cn.pool.ntp.org'
    ntptime.NTP_DELTA -=8*60*60
    for _ in range(15):
        try:
            ntptime.settime()
            break
        except:
            utime.sleep(1)
else:
    import esp32
    nvs = esp32.NVS('esp_camera')
    try:
        t=nvs.get_i32('time')
        import machine
        import utime
        tm=utime.gmtime(t)
        machine.RTC().datetime((tm[0], tm[1], tm[2], tm[6] + 1, tm[3], tm[4], tm[5], 0))
    except OSError:
        pass

def check_boot_status():
    import machine
    if(machine.reset_cause() == machine.WDT_RESET or machine.wake_reason()==machine.WDT_RESET):
        print('Meet WDT Reset')

check_boot_status()

import esp_camera
esp_camera.Time_Lapse_Photo(interval=600).run()


# from machine import SoftI2C,Pin
# import bh1750
# import utime
# import machine
#
# i2c=SoftI2C(scl=Pin(14),sda=Pin(15))
# s=bh1750.BH1750(i2c,35)
#
# def log(str):
#     dt = utime.localtime()
#     ds = '{}-{}-{} {}:{}'.format(dt[0],dt[1],dt[2],dt[3],dt[4])
#     print('{}:{}'.format(ds,str))
#
# def _measure():
#     wdt=machine.WDT(timeout=int(15*1000))
#     while(True):
#         log(' luminance is: {}'.format(s.luminance(bh1750.BH1750.ONCE_LOWRES)))
#         wdt.feed()
#         log(' wdt feeded!')
#         utime.sleep(10)
#
# import _thread
# _thread.start_new_thread(_measure,())



