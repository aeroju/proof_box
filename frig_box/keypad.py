
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
        _c_pks=[]
        _l_pks=[]
        while(True):
            for k,v in keys.items():
                if(v.value()==press_value):
                    _c_pks.append(k)
            if( len(_c_pks)>0):
                _l_pks.clear()
                _l_pks.extend(_c_pks)
            else:
                if(len(_l_pks)>0):
                    print('key pressed:',_l_pks)
                    for c in self._callbacks:
                        c(_l_pks)
                    _l_pks.clear()
            _c_pks.clear()
            await uasyncio.sleep_ms(200)

    def start(self):
        _thread.start_new_thread(self.run,(self._keys,self._press_value))

    def start_task(self,loop):
        loop.create_task(self.run())



