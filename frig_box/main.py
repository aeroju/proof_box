
import dht
from machine import PWM,Pin,SPI,Timer
import max7219
import utime
import random
import uasyncio
from keypad import Keypad
from controlers import *
from outputs import *
import gc
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

class Controller():
    def __init__(self):
        #sensros init
        self.up_sensor=dht.DHT22(Pin(up_sensor))
        self.low_sensor=dht.DHT22(Pin(low_sensor))

        #controlers init
        self.controls=[]
        self.v12_control=Pin(v12_pin,Pin.OUT)
        self.v12_control.on()
        self.controls.append(FanControl(Pin(fan_pwm),fan_1212))
        self.controls.append(FrigControl(Pin(frig_pin,Pin.OUT)))
        self.controls.append(HeaterControl(None,PWM(Pin(heater_pwm,Pin.OUT))))
        self.controls.append(HumiControl(Pin(humi_pin,Pin.OUT),None))
        self.controls.append(LightControl(Pin(light_pin,Pin.OUT)))

        #init parameters, default is cooler
        self.start_time=utime.time()
        self.target_temp=2
        self.target_humi=None

        #init keypad input
        self.keypad=Keypad(keys)
        self.keypad.register_callback(self.on_key_press)
        self.keypad.start()

        #init outputs
        spi=SPI(1,baudrate=10000000, polarity=1, phase=0,
                     sck=Pin(sck),
                     mosi=Pin(mosi))
        ss = Pin(cs)
        self.display=max7219.Matrix8x8(spi,ss,8,Timer(1))
        self.peak_output=PeakOutput(self.start_time)
        self.web_output=WebOutput()
        self.web_output.register_callback(self.on_key_press)
        self.web_output.start()

    async def _run(self,us,ls):
        while(True):
            try:
                us.measure()
                ut=us.temperature()
                uh=us.humidity()
            except:
                ut=None
                uh=None
            utime.sleep(1)
            try:
                ls.measure()
                lt=ls.temperature()
                lh=ls.humidity()
            except:
                lt=None
                lh=None
            msg={'t1':ut,'t2':lt,'h1':uh,'h2':lh,'t':utime.time(),'bt':utime.time()-self.start_time}

            #call controls
            uasyncio.create_task(self.run_controls(msg))

            #call outputs
            for c in self.controls:
                msg[c.name]=c.status
            msg['tt']=self.target_temp
            msg['th']=self.target_humi
            uasyncio.create_task(self.display_msg(msg))
            uasyncio.create_task(self.output(msg))


            #wait 5 seconds
            await uasyncio.sleep(5)
            # print('mem left:',gc.mem_free())
        pass

    async def display_msg(self,msg):
        t1=msg.get('t1')
        t2=msg.get('t2')
        self.display.write_txt(nums_to_str(t1,t2))

    async def output(self,msg):
        ct=utime.localtime(msg.get('t'))
        cts='{:02d}:{:02d}:{:02d}'.format(ct[3],ct[4],ct[5])
        def _sec_to_str(s):
            h=int(s/3600)
            m=int((s-h*3600)/60)
            s=s-h*3600-m*60
            return '{:02d}:{:02d}:{:02d}'.format(h,m,s)
        print('Curr:'+cts + ' From boot:'+_sec_to_str(utime.time()-self.start_time))
        print('  Low: ({},{})'.format( msg.get('t1') ,msg.get('h1'))+ ' High: ({},{})'.format( msg.get('t2'),msg.get('h2')))
        self.peak_output.run(msg,print)
        self.web_output.run(msg)

    async def run_controls(self,msg):
        for c in self.controls:
            t = uasyncio.create_task(c.run(msg,[self.target_temp,self.target_humi]))

    def switch_light(self):
        for c in self.controls:
            if(isinstance(c,LightControl)):
                c.switch()

    def switch_mode(self):
        pass

    def on_key_press(self,pressed_keys):
        if(len(pressed_keys)==2):
            if('temp_up' in pressed_keys and 'temp_down' in pressed_keys):
                self.switch_light()
            if('humi_up' in pressed_keys and 'humi_down' in pressed_keys):
                self.switch_mode()
        else:
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
            self.display.write_flash_txt(nums_to_str(self.target_temp,self.target_humi))

    def run(self):
        def _asyncio_run():
            uasyncio.run(self._run(self.up_sensor,self.low_sensor))
        _thread.start_new_thread(_asyncio_run,())


