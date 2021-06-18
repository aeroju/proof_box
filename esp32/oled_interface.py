from machine import Pin, SoftI2C
# from ssd1306 import SSD1306_I2C
from oled import Write, SSD1306_I2C
import fonts_32
import fonts_16
import utime
import _thread
from utils import *
from message_center import MessageCenter

status_str=['Preparing','Waiting','Proofing']
class OLED_interface():
    def __init__(self):
        self.i2c = SoftI2C(scl=Pin(int(CONFIG['oled_scl_pin'])), sda=Pin(int(CONFIG['oled_sda_pin'])))
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
        self._drawing_lock=_thread.allocate_lock()
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_setting_change)

    def on_setting_change(self):
        self.target_temp = int(CONFIG[SETTINGS_TARGET_TEMP])
        self.target_humi = int(CONFIG[SETTINGS_TARGET_HUMI])

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            if(self._drawing_lock.acquire(0)):
                try:
                    self.oled.fill(0)
                    self.write_16.text(msg['value'],3,3)
                    self.oled.show()
                finally:
                    self._drawing_lock.release()
        elif(msg['type']==MSG_TYPE_STATUS):
            if(self._drawing_lock.acquire(0)):
                try:
                    ct = utime.time()
                    if(ct-self._last_show_time>=30):
                        _thread.start_new_thread(self.draw_status_new,(msg['value'],))
                        self._last_show_time = ct
                finally:
                    self._drawing_lock.release()

    def status_to_str(self,st,st_time):
        ret = status_str[st]
        if(st>0):
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

    def change_status(self,status):
        st_str=['','JM','1F','2F']
        if(self._drawing_lock.acquire(0)):
            try:
                self.oled.fill(0)
                self.oled.text(st_str[status],40,20)
                self.oled.show()
            finally:
                self._drawing_lock.release()

    def draw_status_new(self,status):
        self.oled.fill(0)
        self.write_16.text(self.sec_to_str(int(status['proof_time'])),20,0)
        self.write_32.text('{}D/{}%'.format(int(status['temp']),int(status['humi'])),8,16)
        self.write_16.text('({}){}'.format(self.target_temp,'on' if status['is_heating'] else 'off'),10,48)
        self.write_16.text('({}){}'.format(self.target_humi,'on' if status['is_humi'] else 'off'),70,48)
        # self.write_16.text('({},{})'.format(self.min_temp,self.max_temp),6,48)
        # self.write_16.text('({},{})'.format(self.min_humi,self.max_humi),69,48)
        self.oled.show()
