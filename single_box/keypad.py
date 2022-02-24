
from machine import Pin
import machine
import uasyncio
import utime
import _thread
import esp32

_keys={'K1':12 ,'K2':13,'K3':27,'K4':14}
class Keypad():
    def __init__(self,keys=None):
        if(keys is None):
            keys=_keys
        print(keys)
        self._keys={}
        self._press_value=1
        for k,v in keys.items():
            Pin(v,Pin.OUT).value(0)
            self._keys[k]=Pin(v,Pin.IN)
            # print('{}:{}'.format(k,self._keys[k].value()))
            # self._press_value=not self._keys[k].value()
        print('default key value:',self._press_value)
        self._callbacks=[]

    def register_callback(self,c):
        if(c not in self._callbacks):
            self._callbacks.append(c)

    def run(self,stop_sign,keys=None,press_value=None):
        if(keys is None):
            keys=self._keys
        if(press_value is None):
            press_value=self._press_value
        _c_pks=[]
        _l_pks=[]
        while(not stop_sign.is_set()):
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

    def sleep_wait(self):
        # for p in self._keys.values():
        #     p.value(0)
        # esp32.wake_on_ext1(pins=list(self._keys.values()),level=esp32.WAKEUP_ANY_HIGH)
        # print('try go to sleep after 100 ms')
        # utime.sleep_ms(100)
        # machine.lightsleep()
        print('wake up')


    def start(self):
        _thread.start_new_thread(self.run,(self._keys,self._press_value))

    def start_task(self,loop,stop_sign):
        loop.create_task(self.run(stop_sign))


def start_background_loop(loop) -> None:
    loop.run_forever()

def goto_sleep_task(stop_sign,keypad):
    last_check_time=utime.time()
    while(True):
        if(stop_sign.is_set()):
            if(utime.time()-last_check_time>180):
                print('not in runing status for 3 minutes, go to sleep')
                a=utime.time()
                keypad.sleep_wait()
                if(utime.time()-a<2):
                    keypad.sleep_wait()
                last_check_time=utime.time()
                print('keypad was touched, wake up')
            else:
                print('stop sign is setted in {} secs'.format(utime.time()-last_check_time))
        else:
            last_check_time=utime.time()
            print('still running')
        await uasyncio.sleep(20)

def test(stop_sign):
    loop = uasyncio.new_event_loop()
    _thread.start_new_thread(start_background_loop,(loop,))
    k=Keypad()
    loop.create_task(goto_sleep_task(stop_sign,k))
