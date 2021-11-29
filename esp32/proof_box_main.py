# import wifi_interface

#######################
#   import upip
#   upip.install('picoweb')
#   upip.install("micropython-oled")

import utime
import machine
import _thread
import gc
gc.enable()

import proof_box_controller
import oled_interface
import db_interface
gc.collect()
import proof_box_web
import web_interface
# import power_controller
from utils import *
from message_center import MessageCenter


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
            machine.reset()
        elif(op==OPERATION_POWER_DOWN):
            self.power_off()
            utime.sleep_ms(500)
            print('going to deep sleep, touch to restart')
            machine.deepsleep()
        elif(op==OPERATION_BEGIN_POWER_DOWN):
            self.controller.status=STATUS_SHUTTING_DOWN
            print('begin shut down sequence')

    def power_on(self):
        self._power_on_pin.on()
        utime.sleep_ms(800)

    def power_off(self):
        self._power_on_pin.off()

    def init_power_control(self):
        self._power_on_pin=machine.Pin(int(CONFIG['power_control_pin']),machine.Pin.OUT)
        self.power_on()
        _thread.start_new_thread(self.touch_control,())
        MessageCenter.registe_message_callback(MSG_TYPE_MANUAL_OPERATION,self.on_manual_operation)

    def touch_control(self):
        light_status=False
        t=0
        touch_pad=machine.TouchPad(machine.Pin(int(CONFIG['touch_pad_pin'])))
        while(True):
            if(touch_pad.read()<200):
                t=t+1
            else:
                if(t>0):
                    if(t<=3):
                        if(light_status):
                            self.controller.inner_light_pin.off()
                        else:
                            self.controller.inner_light_pin.on()
                        light_status=not light_status
                    elif(t>=10):
                        touch_pad.config(300)
                        import esp32
                        esp32.wake_on_touch(True)
                        self.controller.status=STATUS_SHUTTING_DOWN
                        print('begin shut down sequence')
                        # MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_POWER_DOWN)
                    elif(t>=6):
                        status=self.controller.status
                        if(status+1 in [STATUS_PROOFING_JM,STATUS_PROOFING_1F,STATUS_PROOFING_2F]):
                            self.oled_interface.change_status(status+1)
                            self.controller.status=status+1
                        else:
                            self.controller.status=1

                    t=0

            utime.sleep_ms(500)