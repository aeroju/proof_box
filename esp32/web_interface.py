import _thread
from utils import *
from message_center import MessageCenter

class _Web_Interface():
    def __init__(self):
        self._lock = _thread.allocate_lock()
        self.__status={}
        self.status=-1
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_change_settings)
        # self.on_setting_change()

    def on_change_settings(self,msg):
        print('web interface get seting change message',msg)
        target_type=self.status if msg.get('target_type') is None else msg.get('target_type')
        if(target_type==-1):
            target_type=TARGET_JM
        settings=JM_SETTING if msg.get('settings') is None else msg.get('settings')
        self.status=target_type
        self.target_temp=settings['target_temp']
        self.target_humi=settings['target_humi']


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
        target_temp=self.target_temp
        target_humi=self.target_humi
        for k,v in settings.items():
            if(k=='target_temp'):
                target_temp=int(v)
            elif(k=='target_humi'):
                target_humi=int(v)

        msg={'settings':{'target_temp':target_temp,'target_humi':target_humi}}
        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,msg)

    def on_operation(self,operation):
        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,int(operation))

    def on_manual_operation(self,op):
        print('send manual operation message:',op)
        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,int(op))

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



