import uos
from utils import *
import machine
import utime
from message_center import MessageCenter

db_file='proof_box.db'

class _DB_Interface():
    def __init__(self):
        self.last_min=0
        try:
            if(machine.reset_cause() not in (machine.SOFT_RESET,machine.WDT_RESET)):
                uos.remove(db_file)
                with open(db_file,'wb') as f:
                    f.write(b'')
        except OSError:
            pass
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,save_config)
        pass

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            pass
        elif(msg['type']==MSG_TYPE_STATUS):
            time = utime.time()
            if(time-self.last_min>=60):
                tt = utime.localtime(time)
                time_str = '{}-{}-{} {}:{}:{}'.format(tt[0],tt[1],tt[2],tt[3],tt[4],tt[5])
                self.save_file(time_str, msg['value'])
                self.last_min = time

    def save_file(self,time,values):
        temp = values['temp'] if('temp' in values.keys()) else -1
        humi = values['humi'] if('humi' in values.keys()) else -1
        with open(db_file,'a') as file:
            file.write('{}|{}|{}\n'.format(time,temp,humi))

_db_interface = _DB_Interface()
def DB_Interface():
    return _db_interface