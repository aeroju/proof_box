from machine import Pin, I2C
# from ssd1306 import SSD1306_I2C
from oled import Write, SSD1306_I2C
import fonts_32
import fonts_16
import utime
import _thread
from utils import *

status_str=['Preparing','Waiting','Proofing']
class OLED_interface():
    def __init__(self):
        self.i2c = I2C(-1, scl=Pin(int(CONFIG['oled_scl_pin'])), sda=Pin(int(CONFIG['oled_sda_pin'])))
        self.oled_width = int(CONFIG['oled_width'])
        self.oled_height = int(CONFIG['oled_height'])
        self.oled = SSD1306_I2C(self.oled_width, self.oled_height, self.i2c)
        self.write_32=self.oled
        self.write_16=self.oled
        self.write_32=Write(self.oled,fonts_32)
        self.write_16=Write(self.oled,fonts_16)
        self.oled.invert(False)
        self.oled.fill(0)
        self.oled.show()
        self._last_show_time=0
        self._last_show_lock=_thread.allocate_lock()
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_setting_change)

    def on_setting_change(self):
        self.min_temp = int(CONFIG[SETTINGS_MIN_TEMP])
        self.max_temp = int(CONFIG[SETTINGS_MAX_TEMP])
        self.min_humi = int(CONFIG[SETTINGS_MIN_HUMI])
        self.max_humi = int(CONFIG[SETTINGS_MAX_HUMI])

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            self.oled.fill(0)
            self.write_16.text(msg['value'],3,3)
            self.oled.show()
        elif(msg['type']==MSG_TYPE_STATUS):
            self.draw_status_new( msg['value'])

    def draw_status(self,status):
        self.oled.fill(0)
        self.oled.text('Temp:{}'.format(int(status['temp'])),3,3)
        self.oled.text('Humi:{}'.format(int(status['humi'])),70,3)

        self.oled.text('Settings:',3,20)

        self.oled.text('Temp:({},{})'.format(self.min_temp,self.max_temp),3,30)
        self.oled.text('Humi:({},{})'.format(self.min_humi,self.max_humi),3,40)

        self.oled.text('H:{}'.format('On' if status['is_heating'] else 'Off'),0,50)
        self.oled.text('M:{}'.format('On' if status['is_humi'] else 'Off'),43,50)
        self.oled.text('F:{}'.format('On' if status['is_fan'] else 'Off'),86,50)
        self.oled.show()

    def status_to_str(self,st,st_time):
        ret = status_str[st]
        if(st==STATUS_PROOFING):
            ret +=":"
            h=int(st_time/3600)
            m=int((st_time-h*3600)/60)+1
            # s=st_time-h*3600-m*60
            if(h>0):
                ret += "{}:".format(h)
            if(m>0):
                ret += "{}:".format(m)
            # ret += "{}S".format(s)
        return ret

    def sec_to_str(self,st_time):
        h=int(st_time/3600)
        m=int((st_time-h*3600)/60)
        s=st_time-h*3600-m*60
        return "{:02d}:{:02d}:{:02d}".format(h,m,s)

    def draw_status_new(self,status):
        if(self._last_show_lock.acquire()):
            try:
                ct = utime.time()
                if(ct-self._last_show_time>=30):
                    self.oled.fill(0)
                    self.write_16.text(self.sec_to_str(int(status['proof_time'])),20,0)
                    self.write_32.text('{}D/{}%'.format(int(status['temp']),int(status['humi'])),8,16)
                    self.write_16.text('({},{})'.format(self.min_temp,self.max_temp),6,48)
                    self.write_16.text('({},{})'.format(self.min_humi,self.max_humi),69,48)
                    self.oled.show()
                    self._last_show_time = ct
            finally:
                self._last_show_lock.release()