import max7219
from machine import Pin,SPI,Timer
import _thread,utime
from utils import *
from message_center import MessageCenter

class LED_Interface():
    def __init__(self):
        self.spi=SPI(1,baudrate=10000000, polarity=1, phase=0,
                     sck=Pin(int(CONFIG['led_sck'])),
                     mosi=Pin(int(CONFIG['led_mosi'])))
        self.ss = Pin(int(CONFIG['led_cs']))
        self.display=max7219.Matrix8x8(self.spi,self.ss,8)
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        # MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_setting_change)

    def display_message(self,msg):
        if(msg['type']==MSG_TYPE_STATUS):
            t = msg['value']['temp']
            h = msg['value']['humi']
            txt='{:>2d}'.format(int(t)) + '.{:01d}'.format(int(t*10)-int(t)*10) + \
                '  ' + \
                '{:>2d}'.format(int(h)) + '.{:01d}'.format(int(h*10)-int(h)*10)
            self.display.write_txt(txt)

    def display_setup(self,temp,humi):
        txt='{:>2d}.0'.format(temp)  + \
            '  ' + \
            '{:>2d}.0'.format(humi)
        self.display.write_flash_txt(txt)


# from machine import Pin,SPI
# p=Pin(15,Pin.OUT)
# p.on()
# spi=SPI(1,baudrate=10000000, polarity=1, phase=0,sck=Pin(21),mosi=Pin(23))
# ss=Pin(22)
# import max7219
# d=max7219.Matrix8x8(spi,ss,8)
# d.init()
# d.write_txt('12.3  56.0')
# from uart_sm78 import SM78
#
# DI=5
# DE=16
# RO=17
# sm = SM78(tx=DI,rx=RO,ctl=DE)
# sm.measure()
# sm.get_temp_and_humi()


