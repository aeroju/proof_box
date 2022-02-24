

from machine import PWM,Pin,SPI,WDT,Timer

import utime




#controlers pin
fan_pin=25
fan_in=26
t=utime.ticks_ms()
rpm=0
def fell(n):
    global t
    global rpm
    dt=utime.ticks_diff(utime.ticks_ms(),t)
    if(dt<5):
        return
    freq=1/dt
    rpm=(freq/2)*60
    t=utime.ticks_ms()
pm=Pin(fan_in,Pin.IN,Pin.PULL_UP)
pm.irq(handler=fell,trigger=Pin.IRQ_FALLING)

pf=PWM(Pin(fan_pin),freq=25*1024)
pf.duty(1023)
utime.sleep(5)
for i in range(10):
    print(rpm)
    utime.sleep(2)

pf.duty(512)
utime.sleep(5)
for i in range(10):
    print(rpm)
    utime.sleep(2)
