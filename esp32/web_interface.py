import _thread
from utils import *
from message_center import MessageCenter

class _Web_Interface():
    def __init__(self):
        self._lock = _thread.allocate_lock()
        self.__status={}
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_setting_change)
        # self.on_setting_change()

    def on_setting_change(self):
        self.target_temp=CONFIG[SETTINGS_TARGET_TEMP]
        self.target_humi=CONFIG[SETTINGS_TARGET_HUMI]
        # self.proof_material=CONFIG['proof_material']

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            pass
        elif(msg['type']==MSG_TYPE_STATUS):
            if(self._lock.acquire(0)):
                self.__status.clear()
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
            CONFIG[k]=int(v)
        self.on_setting_change()
        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,None)

    def on_operation(self,operation):
        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,int(operation))

    def on_manual_operation(self,op):
        print('send manual operation message:',op)
        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,op)

    def get_supported_material(self):
        return CONFIG['supported_materials']

    def get_settings(self):
        settings={}
        settings[SETTINGS_TARGET_TEMP]=self.target_temp
        settings[SETTINGS_TARGET_HUMI]=self.target_humi
        # settings['proof_material']=self.proof_material
        return settings


_web_interface=_Web_Interface()
def Web_Interface():
    return _web_interface



