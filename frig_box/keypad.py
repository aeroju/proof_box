
from machine import Pin
import uasyncio
import utime
import _thread

_keys={'K1':12 ,'K2':32,'K3':27,'K4':14}
class Keypad():
    def __init__(self,keys=None):
        if(keys is None):
            keys=_keys
        print(keys)
        self._keys={}
        self._press_value=1
        for k,v in keys.items():
            self._keys[k]=Pin(v,Pin.IN,Pin.PULL_UP)
            self._press_value=not self._keys[k].value()
        print('default key value:',self._press_value)
        self._callbacks=[]

    def register_callback(self,c):
        if(c not in self._callbacks):
            self._callbacks.append(c)

    def run(self,keys=None,press_value=None):
        if(keys is None):
            keys=self._keys
        if(press_value is None):
            press_value=self._press_value
        _pks=[]
        while(True):
            for k,v in keys.items():
                if(v.value()==press_value):
                    _pks.append(k)
            if( len(_pks)>0):
                print('key pressed:',_pks)
                for c in self._callbacks:
                    c(_pks)
            _pks.clear()
            utime.sleep_ms(200)

    def start(self):
        _thread.start_new_thread(self.run,(self._keys,self._press_value))



