
import dht
from machine import PWM,Pin,SPI,WDT
import max7219
import _thread
import utime
import random

up_sensor=13
low_sensor=14

fan=26

sck=18
mosi=19
cs=23

class Controller():
    def __init__(self):
        self.up_sensor=dht.DHT22(Pin(up_sensor))
        self.low_sensor=dht.DHT22(Pin(low_sensor))
        self.fan_pwm=PWM(Pin(fan),freq=1000)
        self.fan_pwm.duty(0)
        spi=SPI(1,baudrate=10000000, polarity=1, phase=0,
                     sck=Pin(sck),
                     mosi=Pin(mosi))
        ss = Pin(cs)
        self.display=max7219.Matrix8x8(spi,ss,8)

    def _run(self,us,ls,fp,display):
        wdt=WDT(timeout=10000)
        def _th(t1,t2):
            s1 = '{: 04.1f}'.format(t1) if t1!=-100 else '    '
            s2 = '{: 04.1f}'.format(t2) if t2!=-100 else '    '
            return  s1 + s2

        def _duty(t1,t2):
            if(t1==-100 or t2==-100):
                return 100
            ts=abs(t1-t2)
            #上下温差大于2度，风扇全速，pwm=1000
            if(ts>2):
                return 1000
            #上下温差小于0.5，pwm=100
            if(ts<0.5):
                return 100
            #温差与转速线性
            return int(ts/2*1000)

        while(True):
            ut=lt=0.0
            try:
                us.measure()
                ut=us.temperature()
            except:
                ut=-100
            utime.sleep(1)
            try:
                ls.measure()
                lt=ls.temperature()
            except:
                lt=-100
            d=_duty(ut,lt)
            fp.duty(d)
            txt=_th(ut,lt)
            print(txt,'  ',d)
            display.write_txt(txt)
            utime.sleep(5)
            wdt.feed()
        pass

    def run(self):
        _thread.start_new_thread(self._run,(self.up_sensor,self.low_sensor,self.fan_pwm,self.display))


