import _thread
import uasyncio
import dht
import utime
from machine import Pin

def start_background_loop(loop) -> None:
    loop.run_forever()

#测试一下使用async是否有作用
def measure(ss):
    retry=0
    while(retry<3):
        try:
            #测试一下使用async是否有作用
            ss.measure()
            break
        except :
            retry+=1
            utime.sleep_ms(200)
    if(retry<3):
        return ss.temperature(),ss.humidity()
    return None,None

def run_a_while(sensor,stop_sign):
    st=0
    while(not stop_sign.is_set()):
        t,h=measure(sensor)
        print(t,h)
        await uasyncio.sleep(5)
        print('runing for {} times'.format(st))
        st+=1

def main():
    loop = uasyncio.new_event_loop()
    stop_sign=uasyncio.Event()
    sensor=dht.DHT22(Pin(13))
    _thread.start_new_thread(start_background_loop,(loop,))

    task_run = loop.create_task(run_a_while(sensor,stop_sign))
    import keypad
    k=keypad.Keypad({'temp_up':25,'temp_down':26,'humi_up':32,'humi_down':33})
    k.start_task(loop)

    print('wait 30 secs for task to run')
    utime.sleep(30)
    print('set stop sign')
    stop_sign.set()
    print('stopping')
    loop.stop()