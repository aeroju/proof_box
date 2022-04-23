from machine import Pin, SoftI2C
# from ssd1306 import SSD1306_I2C
from oled import Write, SSD1306_I2C
import fonts_32
import fonts_16
import utime
import uasyncio
from utils import *
from message_center import MessageCenter

class OLED_interface():
    def __init__(self,scl,sda):
        self.i2c = SoftI2C(scl=Pin(scl), sda=Pin(sda))
        self.oled_width = 128
        self.oled_height = 64
        self.oled = SSD1306_I2C(self.oled_width, self.oled_height, self.i2c)
        self.write_lock=uasyncio.Event()
        self.write_32=self.oled
        self.write_16=self.oled
        self.write_32=Write(self.oled,fonts_32)
        self.write_16=Write(self.oled,fonts_16)
        self.oled.invert(False)
        self.oled.fill(0)
        self.oled.show()

    def display_message(self,msg):
        if(not self.write_lock.is_set()):
            self.write_lock.set()
            self.oled.fill(0)

            if(msg.get('st') is not None):
                self.write_16.text(self.sec_to_str(msg.get('st')),20,0)
            self.write_32.text('{}D/{}D'.format(int(msg['tin']),int(msg['tout'])),8,16)
            t=msg.get('t')
            if(t is not None):
                self.write_16.text('{}-{}-{} {}:{}:{}'.format(t[0],t[1],t[2],t[3],t[4],t[5]),0,120)
            self.oled.show()
            self.write_lock.clear()

    def sec_to_str(self,st_time):
        h=int(st_time/3600)
        m=int((st_time-h*3600)/60)
        s=st_time-h*3600-m*60
        return "{:02d}H{:02d}M{:02d}S".format(h,m,s)

