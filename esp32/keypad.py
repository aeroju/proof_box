
from machine import Pin
import _thread
import utime

keys={'K1':34,'K2':35,'K3':27,'K4':12}
class Keypad():
    def __init__(self,keys=keys):
        print(keys)
        self._keys={}
        self._press_value=1
        for k,v in keys.items():
            self._keys[k]=Pin(v,Pin.IN,Pin.PULL_DOWN)
            self._press_value=not self._keys[k].value()

        print('default key value:',self._press_value)

        self._callbacks=[]

    def start(self):
        _thread.start_new_thread(self._run,(self._keys,self._press_value))

    def register_callback(self,c):
        if(c not in self._callbacks):
            self._callbacks.append(c)

    def _run(self,keys,press_value):
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



