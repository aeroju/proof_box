from machine import WDT,Pin
import utime
from utils import *

class PowerController():
    def __init__(self):
        self._wdt=WDT(timeout=60000)
        self._power_on_pin=Pin(15,Pin.OUT)
        self.power_on()
        MessageCenter.registe_message_callback(MSG_TYPE_MANUAL_OPERATION,self.on_manual_operation)
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.on_status_message)

    def on_status_message(self,m):
        self._wdt.feed()

    def on_manual_operation(self,op):
        if(op==OPERATION_RESET):
            self.power_off()
            # print('will reset in 2 secs.')
            utime.sleep(2)
            import machine
            machine.soft_reset()

    def power_on(self):
        self._power_on_pin.on()
        utime.sleep_ms(200)

    def power_off(self):
        self._power_on_pin.off()


