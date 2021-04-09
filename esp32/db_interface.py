import utime
import _thread
from utils import *

db_file='proof_box.db'

class _DB_Interface():
    def __init__(self):
        self.last_min=0
        self._lock = _thread.allocate_lock()
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,save_config)
        pass

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            pass
        elif(msg['type']==MSG_TYPE_STATUS):
            time = utime.time()
            if(time-self.last_min>=60):
                self.save_file(time, msg['value'])
                self.last_min = time

    def save_file(self,time,values):
        if('temp' in values.keys()): temp = values['temp']
        else: temp=-1
        if('humi' in values.keys()): humi = values['humi']
        else: humi=-1
        if(self._lock.acquire()):
            try:
                with open(db_file,'a') as file:
                    file.write('{}|{}|{}\n'.format(time,temp,humi))
            finally:
                self._lock.release()

    def read_history(self,begin=None,end=None):
        if(self._lock.acquire()):
            try:
                with open(db_file,'r') as f:
                    ret=[]
                    for line in f:
                        time,temp,humi = line.split('|')
                        if((begin is None or time>=begin)
                            and (end is None or time<=end)):
                            ret.append([time,temp,humi])
                    return ret
            except:
                return []
            finally:
                self._lock.release()

_db_interface = _DB_Interface()
def DB_Interface():
    return _db_interface