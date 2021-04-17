# import wifi_interface

#######################
#   import upip
#   upip.install('picoweb')
#   upip.install('uasyncio')
#   upip.install('pycopy-ulogging')
#   upip.install("micropython-oled")


import proof_box_controller
import oled_interface
import db_interface
import proof_box_web
import web_interface
# import power_controller
from utils import *
import utime
import gc
import machine
gc.enable()

class ProofBox():
    def __init__(self):
        read_config()
        gc.collect()
        print('mem before startup:',gc.mem_free())
        self.init_power_control()
        # 启动温湿度控制
        self.controller = proof_box_controller.ProofBoxController()
        # 启动显示界面
        self.oled_interface = oled_interface.OLED_interface()
        self.db_interface = db_interface.DB_Interface()
        self.web_interface = web_interface.Web_Interface()
        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,None)
        MessageCenter.start()
        self.controller.start()
        gc.collect()
        utime.sleep(2)
        print('mem after controller startup:',gc.mem_free())
        proof_box_web.start_web()
        pass

    def on_manual_operation(self,op):
        if(op==OPERATION_RESET):
            self.power_off()
            utime.sleep_ms(500)
            print('going to restart')
            machine.soft_reset()
        elif(op==OPERATION_POWER_DOWN):
            self.power_off()
            utime.sleep_ms(500)
            print('going to deep sleep, touch to restart')
            machine.deepsleep()

    def power_on(self):
        self._power_on_pin.on()
        utime.sleep_ms(800)

    def power_off(self):
        self._power_on_pin.off()

    def init_power_control(self):
        self._power_on_pin=machine.Pin(int(CONFIG['power_control_pin']),machine.Pin.OUT)
        self.power_on()
        MessageCenter.registe_message_callback(MSG_TYPE_MANUAL_OPERATION,self.on_manual_operation)

