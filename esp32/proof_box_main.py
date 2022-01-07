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
# import oled_interface
import led_interface
import db_interface
gc.collect()
import proof_box_web
import web_interface
import keypad
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
        # self.oled_interface = oled_interface.OLED_interface()
        self.led_interface=led_interface.LED_Interface()
        self.db_interface = db_interface.DB_Interface()
        self.web_interface = web_interface.Web_Interface()

        self.init_keypad_control()
        MessageCenter.start()
        self.controller.start()
        gc.collect()
        utime.sleep(2)
        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,{'target_type':TARGET_JM})
        print('mem after controller startup:',gc.mem_free())
        proof_box_web.start_web()

        pass

    def on_manual_operation(self,op):
        op = int(op)
        print('receive manual operation:',op)
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

    def power_on(self):
        self._power_on_pin.on()
        utime.sleep_ms(800)

    def power_off(self):
        self._power_on_pin.off()

    # def start_power_off_sequence(self):
    #     MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_BEGIN_POWER_DOWN)
    #     # self.controller.status=STATUS_SHUTTING_DOWN

    def key_control(self,keys):
        if(keys is None):
            return
        if(len(keys)>1):
            if('TEMP_UP' in keys and 'TEMP_DOWN' in keys):
                MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_SWITCH_LIGHT)
            if('HUMI_UP' in keys and 'HUMI_DOWN' in keys):
                MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_BEGIN_POWER_DOWN)
        else:
            target_temp=self.controller.target_temp
            target_humi=self.controller.target_humi
            if('TEMP_UP' in keys):
                target_temp=target_temp+1
                if(target_temp>40):
                    target_temp=40
            elif('TEMP_DOWN' in keys):
                target_temp=target_temp-1
                if(target_temp<0):
                    target_temp=0
            elif('HUMI_UP' in keys):
                target_humi=target_humi+1
                if(target_humi>100):
                    target_humi=60
            elif('HUMI_DOWN' in keys):
                target_humi=target_humi-1
                if(target_humi<60):
                    target_humi=100
            msg={'target_type':self.controller.status,'settings':{'target_temp':target_temp,'target_humi':target_humi}}
            MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,msg)
            self.led_interface.display_setup(target_temp,target_humi)


    def init_keypad_control(self):
        keys={'TEMP_UP':int(CONFIG['temp_up_pin']),
              'TEMP_DOWN':int(CONFIG['temp_down_pin']),
              'HUMI_UP':int(CONFIG['humi_up_pin']),
              'HUMI_DOWN':int(CONFIG['humi_down_pin'])}
        self.keypad=keypad.Keypad(keys)
        self.keypad.register_callback(self.key_control)
        self.keypad.start()

    def init_power_control(self):
        self._power_on_pin=machine.Pin(int(CONFIG['power_control_pin']),machine.Pin.OUT)
        self.power_on()
        # _thread.start_new_thread(self.touch_control,())
        MessageCenter.registe_message_callback(MSG_TYPE_MANUAL_OPERATION,self.on_manual_operation)

    def touch_control(self):
        t=0
        touch_pad=machine.TouchPad(machine.Pin(int(CONFIG['touch_pad_pin'])))
        while(True):
            if(touch_pad.read()<200):
                t=t+1
            else:
                if(t>0):
                    if(t<=3):
                        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_SWITCH_LIGHT)
                    elif(t>=10):
                        touch_pad.config(300)
                        import esp32
                        esp32.wake_on_touch(True)
                        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_BEGIN_POWER_DOWN)
                        print('begin shut down sequence')
                        # MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_POWER_DOWN)
                    elif(t>=6):
                        status=self.controller.status
                        if(status+1 in [TARGET_JM,TARGET_F1,TARGET_F2]):
                            status=status+1
                        else:
                            status=1
                        msg={'target_type':status,'settings':JM_SETTING if status==TARGET_JM else F1_SETTING if status==TARGET_F1 else F2_SETTING if status==TARGET_F2 else JM_SETTING}
                        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,msg)

                    t=0

            utime.sleep_ms(500)

class ExternalControl():
    def __init__(self):
        pass
