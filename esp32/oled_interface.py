from machine import Pin, I2C
import ssd1306
from utils import *

class OLED_interface():
    def __init__(self):
        self.i2c = I2C(-1, scl=Pin(int(CONFIG['oled_scl_pin'])), sda=Pin(int(CONFIG['oled_sda_pin'])))
        self.oled_width = int(CONFIG['oled_width'])
        self.oled_height = int(CONFIG['oled_height'])
        self.oled = ssd1306.SSD1306_I2C(self.oled_width, self.oled_height, self.i2c)
        self.oled.invert(False)
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_setting_change)
        self.on_setting_change()

    def on_setting_change(self):
        self.min_temp = int(CONFIG[SETTINGS_MIN_TEMP])
        self.max_temp = int(CONFIG[SETTINGS_MAX_TEMP])
        self.min_humi = int(CONFIG[SETTINGS_MIN_HUMI])
        self.max_humi = int(CONFIG[SETTINGS_MAX_HUMI])

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            self.oled.fill(0)
            self.oled.text(msg['value'],3,3)
            self.oled.show()
        elif(msg['type']==MSG_TYPE_STATUS):
            self.draw_status( msg['value'])

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

    # def draw_status(self,status):
    #     self.oled.fill(0)
    #     self.oled.text()