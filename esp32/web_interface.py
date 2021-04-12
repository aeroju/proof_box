
# import picoweb
import _thread
# import utime
# import ujson
from utils import *
# import db_interface

class _Web_Interface():
    def __init__(self):
        self._lock = _thread.allocate_lock()
        self.__status={}
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_setting_change)
        # self.on_setting_change()

    def on_setting_change(self):
        self.min_temp = CONFIG[SETTINGS_MIN_TEMP]
        self.max_temp = CONFIG[SETTINGS_MAX_TEMP]
        self.min_humi = CONFIG[SETTINGS_MIN_HUMI]
        self.max_humi = CONFIG[SETTINGS_MAX_HUMI]

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            pass
        elif(msg['type']==MSG_TYPE_STATUS):
            if(self._lock.acquire()):
                # print(msg['value'])
                for k,v in msg['value'].items():
                    self.__status[k]=v
                self._lock.release()

    def get_status(self):
        if(self._lock.acquire()):
            try:
                return self.__status
            finally:
                self._lock.release()
        return None

    def update_settings(self,settings):
        for k,v in settings.items():
            # print(k,':',v)
            CONFIG[k]=int(v)
        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,None)

    def on_operation(self,operation):
        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,int(operation))


_web_interface=_Web_Interface()
def Web_Interface():
    return _web_interface



