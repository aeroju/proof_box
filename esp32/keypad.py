
from machine import Pin
import _thread
import utime

keys={'K1':0,'K2':4,'K3':16,'K4':17}
class Keypad():
    def __init__(self,keys=keys):
        self._keys={}
        for k,v in keys.items():
            self._keys[k]=Pin(v,Pin.IN,Pin.PULL_UP)

        self._callbacks=[]

    def start(self):
        _thread.start_new_thread(self._run,())

    def register_callback(self,c):
        if(c not in self._callbacks):
            self._callbacks.append(c)

    @property
    def pressed_keys(self):
        keys=[]
        for k,v in self._keys.items():
            if(v.value()==0):
                keys.append(k)
        if(len(keys)==0):
            return None
        return keys

    def _run(self):
        while(True):
            pks=self.pressed_keys
            if( pks is not None):
                for c in self._callbacks:
                    c(pks)
            utime.sleep_ms(200)



