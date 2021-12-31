
import machine
import esp32
import uos
import camera
import utime
import micropython
import _thread
# from machine import SoftI2C,Pin
# import bh1750

def is_dark():
    hr=utime.localtime()[3]
    if(hr>=19 or hr<5):
        return True
    return False

store_dir='/sd'

def log(str):
    dt = utime.localtime()
    ds = '{}-{}-{} {}:{}:{}'.format(dt[0],dt[1],dt[2],dt[3],dt[4],dt[5])
    print('{}:{}'.format(ds,str))


class Time_Lapse_Photo():
    def __init__(self,interval=600,mock=False):
        self.interval=interval*1000
        self.mock=mock
        self._log_lock=_thread.allocate_lock()
        self.nvs = esp32.NVS('esp_camera')
        self.wdt=machine.WDT(timeout=int(self.interval*1.5))
        if(not self.mock):
            uos.mount(machine.SDCard(slot=1),store_dir)
        self.last_cnt=self.get_img_count()

        camera.init(0,framesize=12)
        utime.sleep(5)
        self.led=machine.Pin(4,machine.Pin.OUT)
        # self.lum_i2c=SoftI2C(scl=Pin(14),sda=Pin(15))
        # self.lum_sensor=bh1750.BH1750(self.lum_i2c,35)

    def is_dark(self):
        return is_dark()
        # if(self.lum_sensor.luminance(bh1750.BH1750.ONCE_LOWRES)<10):
        #     return True
        # return False

    def log(self,str):
        if(self._log_lock.acquire()):
            log(str)
            self._log_lock.release()

    def get_img_count(self):
        try:
            return self.nvs.get_i32('count')
        except OSError:
            if(not self.mock):
                return len(uos.listdir(store_dir))
            else:
                return 100

    def save_img_count(self,cnt):
        self.nvs.set_i32('count',cnt)
        self.nvs.set_i32('time',utime.time())

    def cap_and_save(self,_):
        fn=store_dir + '/cap_{}.jpg'.format(self.last_cnt)
        if(self.is_dark()):
            self.led.on()
            utime.sleep(2)
        if(not self.mock):
            buf=camera.capture()
            self.led.off()
            with open(fn,'wb') as fh:
                fh.write(buf)
            with open(store_dir + '/dt.txt','a') as fh:
                dt = utime.localtime()
                ds = '{}-{}-{} {}:{}'.format(dt[0],dt[1],dt[2],dt[3],dt[4])
                fh.write('{},{}\n'.format(self.last_cnt,ds))
                # self.log('{},{}\n'.format(self.last_cnt,ds))

        self.last_cnt=self.last_cnt+1
        self.save_img_count(self.last_cnt)
        self.log('capture and saved, feed to wdt now')
        self.wdt.feed()

    def go_sleep(self,t):
        # self.log('begin to sleep')
        machine.lightsleep(t)
        # self.log('week up')

    def cap_and_save_timer(self,a):
        micropython.schedule(self.cap_and_save,None)
        utime.sleep(2)

    def _run_sleep(self):
        while(True):
            t=utime.time()
            self.cap_and_save(None)
            utime.sleep(3)
            d = utime.time()-t
            self.go_sleep(self.interval-d)

    def _run_timer(self):
        self.cap_and_save(None)
        timer0=machine.Timer(0)
        timer0.init(period=self.interval,mode=machine.Timer.PERIODIC,callback=self.cap_and_save_timer)

    def run(self):
        _thread.start_new_thread(self._run_timer,())
        # _thread.start_new_thread(self._run_sleep,())
        # _thread.start_new_thread(self._watch_dog,())

# import machine
# import utime
# led = machine.PWM(machine.Pin(4),freq=1000)
# led.duty(0)
# def flash_led(a):
#     led.duty(10)
#     utime.sleep(2)
#     led.duty(0)
#
# def cap_and_save(a):
#     t = utime.localtime()
#     print('cap at: {}-{}-{} {}:{}:{}'.format(t[0],t[1],t[2],t[3],t[4],t[5]))
#
# timer0=machine.Timer(0)
# timer0.init(period=600000,mode=machine.Timer.PERIODIC,callback=cap_and_save)
# timer1=machine.Timer(1)
# timer1.init(period=10000,mode=machine.Timer.PERIODIC,callback=flash_led)
