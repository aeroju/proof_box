
import machine
import uos
import camera
import utime
import _thread

store_dir='/sd'

def is_dark():
    hr=utime.localtime()[3]
    if(hr>=19 or hr<5):
        return True
    return False

def cap_and_save(led,cnt):
    fn=store_dir + '/cap_{}.jpg'.format(cnt)
    if(is_dark()):
        led.on()
        utime.sleep(2)
    buf=camera.capture()
    led.off()
    with open(fn,'wb') as fh:
        fh.write(buf)

def _run():
    uos.mount(machine.SDCard(slot=1),store_dir)
    cnt=len(uos.listdir(store_dir))
    # if('cnt.txt' in uos.listdir()):
    #     with open('cnt.txt','r') as fh:
    #         cnt=int(fh.readline().strip())
    camera.init(0,framesize=12)
    utime.sleep(5)
    led=machine.Pin(4,machine.Pin.OUT)
    while(True):
        cap_and_save(led,cnt)
        # with open('cnt.txt','w') as fh:
        #     fh.write(str(cnt))
        with open(store_dir + '/dt.txt','a') as fh:
            dt = utime.localtime()
            ds = '{}-{}-{} {}:{}'.format(dt[0],dt[1],dt[2],dt[3],dt[4])
            fh.write('{},{}\n'.format(cnt,ds))
        cnt=cnt+1
        utime.sleep(58)

def run():
    _thread.start_new_thread(_run,())