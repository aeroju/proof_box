
import dht
from machine import PWM,Pin,SPI,Timer
import max7219
import utime
import random
import uasyncio
from keypad import Keypad
from controlers import *
from outputs import *
import gc,uos
import _thread

#sensros pin
up_sensor=13
low_sensor=14

#controlers pwm pin
heater_pwm=10
fan_pwm=19
#out pin
humi_pin=18
v12_pin=5
light_pin=17
frig_pin=16


#input pin
keys={'temp_up':25,'temp_down':26,'humi_up':32,'humi_down':33}

#display pin
sck=clk=22
mosi=din=21
cs=23

fan_1515=PwmSetting(25*1024,16,128*4,16)
fan_1212=PwmSetting(25000,16,1023,16)

def _sec_to_str(s):
    h=int(s/3600)
    m=int((s-h*3600)/60)
    s=s-h*3600-m*60
    return '{:02d}:{:02d}:{:02d}'.format(h,m,s)

def _sec_to_str2(s):
    h=int(s/3600)
    m=int((s-h*3600)/60)
    s=s-h*3600-m*60
    return '{:02d}H{:02d}M{:02d}'.format(h,m,s)

config_file='bread_box.conf'
def read_config():
    if(config_file in uos.listdir()):
        with open(config_file,'r') as f:
            l=f.readline()
            ll=l.split(",")
            if(len(ll)==3):
                return ll[0],int(ll[1]),int(ll[2]) if ll[2] !='None' else None
    return 'COOLER',2,None

def write_config(mode,tt,th):
    with open(config_file,'w') as f:
        f.write(','.join([mode,str(tt),str(th)]))


class Controller():
    def __init__(self):
        self.stop_sign=uasyncio.Event()
        self.stop_sign.set()

        #sensros init
        self.up_sensor=dht.DHT22(Pin(up_sensor))
        self.low_sensor=dht.DHT22(Pin(low_sensor))
        print('up  sensor during startup:',self.__measure(self.up_sensor))
        print('low sensor  during startup:',self.__measure(self.low_sensor))

        #controlers init
        self.controls=[]
        self.v12_control=Pin(v12_pin,Pin.OUT)
        self.fan_control=FanControl(Pin(fan_pwm),fan_1212)
        self.frig_control=FrigControl(Pin(frig_pin,Pin.OUT),stop_timer=Timer(0))
        self.heater_control=HeaterControl(None,PWM(Pin(heater_pwm,Pin.OUT)))
        self.humi_control=HumiControl(Pin(humi_pin,Pin.OUT),None)
        self.light_control=LightControl(Pin(light_pin,Pin.OUT))
        self.controls.extend([self.fan_control,self.frig_control,self.heater_control,self.humi_control,self.light_control])

        #init outputs
        self.display=max7219.Matrix8x8(sck,mosi,cs,8,Timer(1))
        # self.peak_output=PeakOutput(self.start_time)
        self.web_output=WebOutput()
        self.web_output.register_callback(self.on_key_press)
        # self.web_output.start()
        utime.sleep(2)

        #init parameters
        self.start_time=utime.time()
        mode,tt,th=read_config()
        self.target_temp=tt
        self.target_humi=th
        self.set_mode(mode) #'cooler','heater'
        self.display.brightness(0)
        self.display.write_txt('     OFF')
        # print('ready')

        #init keypad input
        self.keypad=Keypad(keys)
        self.keypad.register_callback(self.on_key_press)

        print('begin to start event loop and tasks')
        self.loop=uasyncio.new_event_loop()
        _tid=_thread.start_new_thread(self.start_background_loop,(self.loop,))
        self.keypad.start_task(self.loop)
        self.web_output.start(self.loop)
        self.web_output.run({'r':not self.stop_sign.is_set(),'mode':self.mode})

    def start_background_loop(self,loop) -> None:
        loop.run_forever()

    def test(self):
        def _in_run(stop_sign):
            print('_in_run begin')
            while(not stop_sign.is_set()):
                print('up sensor read in thread:',self.__measure(self.up_sensor))
                print('low sensor read in thread:',self.__measure(self.low_sensor))
                await uasyncio.sleep(10)
            print('_in_run stopped')

        # print('up sensor read in init:',self.__measure(self.up_sensor))
        # print('low sensor read in init:',self.__measure(self.low_sensor))
        self.stop_sign.clear()
        test_task=self.loop.create_task(_in_run(self.stop_sign))
        # uasyncio.run(_run())
        print('wait 30 secs')
        utime.sleep(30)
        print('set stop sign')
        self.stop_sign.set()

    def __measure(self,ss):
        retry=0
        while(retry<3):
            try:
                ss.measure()
                break
            except :
                retry+=1
                uasyncio.sleep_ms(200)
        if(retry<3):
            return ss.temperature(),ss.humidity()
        return None,None

    def _run(self,stop_sign):
        msg={}
        us=self.up_sensor
        ls=self.low_sensor
        while(not stop_sign.is_set()):
            msg['t1'],msg['h1']=self.__measure(us)
            msg['t2'],msg['h2']=self.__measure(ls)
            msg['t']=utime.time()
            msg['r']=not self.stop_sign.is_set()
            msg['bt']=utime.time()-self.start_time

            self.run_controls(msg)

            #get controllers status
            for c in self.controls:
                msg[c.name]=c.status
            msg['tt']=self.target_temp
            msg['th']=self.target_humi
            msg['mode']=self.mode

            #call outputs
            self.display_msg(msg)
            self.output(msg)

            #wait 30 seconds
            await uasyncio.sleep(30)

        msg['r']=not stop_sign.is_set()
        for c in self.controls:
            msg[c.name]=c.status
        msg['tt']=self.target_temp
        msg['th']=self.target_humi
        msg['mode']=self.mode
        self.output(msg)
        print('running thread stopped')


    def display_msg(self,msg):
        self.display.write_txt(nums_to_str(msg.get('t1'),msg.get('t2')))

    def output(self,msg):
        ct=utime.localtime(msg.get('t'))
        cts='{:02d}:{:02d}:{:02d}'.format(ct[3],ct[4],ct[5])

        print('Curr:'+cts + ' From boot:'+_sec_to_str(utime.time()-self.start_time))
        print('  High: ({},{})'.format( msg.get('t1') ,msg.get('h1'))+ ' Low: ({},{})'.format( msg.get('t2'),msg.get('h2')))
        print('  Heater:{}    Frig:{}    Humi:{}    Fan:{}    Light:{}'.format(msg['Heater'][0],msg['Frig'][0],msg['Humi'][0],msg['Fan'][0], msg['Light'][0]))
        # self.peak_output.run(msg,print)
        print(gc.mem_free())
        self.web_output.run(msg)

    def run_controls(self,msg):
        for c in self.controls:
            c.run(msg,[self.target_temp,self.target_humi,self.mode])

    def switch_light(self):
        self.light_control.switch()

    def set_mode(self,mode):
        self.mode=mode
        if(mode=='HEATER'):
            self.target_temp=28
            self.target_humi=85
        else:
            self.target_temp=2
            self.target_humi=None
        self.display.brightness(2)
        self.display.write_flash_txt('  {}'.format(self.mode))
        self.web_output.set_mode(self.mode)
        write_config(self.mode,self.target_temp,self.target_humi)

    def switch_mode(self):
        if(self.mode=='COOLER'):
            self.set_mode('HEATER')
        else:
            self.set_mode('COOLER')

    def _start(self):
        print('start up')
        self.display.brightness(3)
        self.stop_sign.clear()
        utime.sleep_ms(400)
        try:
            self.display.write_rowing_txt('ON')
        except Exception:
            print('eeee')
            pass
        self.v12_control.on()
        self.start_time=utime.time()
        self.loop.create_task(self._run(self.stop_sign))


    def _stop(self):
        print('stop')
        self.stop_sign.set()
        self.fan_control.stop()
        self.humi_control.stop()
        self.heater_control.stop()
        self.frig_control.stop()
        self.light_control.stop()
        self.v12_control.off()
        self.display.brightness(0)
        try:
            self.display.write_rowing_txt('OFF')
        except Exception:
            print('eeee')
        self.display.write_txt('     OFF')
        # self.display.write_flash_txt('  {}'.format(self.mode))

    def check_temp_and_humi_setup(self):
        if(self.mode=='COOLER' and self.target_temp>10):
            self.target_temp=10
        if(self.mode=='HEATER' and self.target_temp<20):
            self.target_temp=20
        if(self.mode=='COOLER' and self.target_humi is not None):
            self.target_humi = None
        if(self.mode=='HEATER' and self.target_humi>100):
            self.target_humi=100
        if(self.mode=='HEATER' and self.target_humi<60):
            self.target_humi=60
        self.display.write_flash_txt(nums_to_str(self.target_temp,self.target_humi))
        write_config(self.mode,self.target_temp,self.target_humi)

    def on_key_press(self,pressed_keys):
        if(len(pressed_keys)==2):
            if('temp_up' in pressed_keys and 'temp_down' in pressed_keys):
                if(not self.stop_sign.is_set()):
                    self.switch_light()
                else:
                    self.switch_mode()
            elif('humi_up' in pressed_keys and 'humi_down' in pressed_keys):
                if(self.stop_sign.is_set()):
                    self._start()
                else:
                    self.display.write_txt(_sec_to_str2(utime.time()-self.start_time))
            elif('temp_val' == pressed_keys[0]):
                if(self.stop_sign.is_set()):
                    return
                self.target_temp=int(pressed_keys[1])
                self.check_temp_and_humi_setup()
            elif('humi_val' == pressed_keys[0]):
                if(self.stop_sign.is_set()):
                    return
                self.target_humi=int(pressed_keys[1])
                self.check_temp_and_humi_setup()
            elif('switch_mode'==pressed_keys[0]):
                self.set_mode(pressed_keys[1])
            elif('temp_up' in pressed_keys and 'humi_down' in pressed_keys):
                if(not self.stop_sign.is_set()):
                    self._stop()
        else:
            if(self.stop_sign.is_set()):
                return
            if('temp_up' in pressed_keys):
                self.target_temp+=1
            elif('temp_down' in pressed_keys):
                self.target_temp-=1
            elif('humi_up' in pressed_keys):
                if(self.target_humi is None):
                    self.target_humi=81
                else:
                    self.target_humi+=1
            elif('humi_down' in pressed_keys):
                if(self.target_humi is None):
                    self.target_humi=79
                else:
                    self.target_humi-=1
            self.check_temp_and_humi_setup()





