
import dht
from uart_sm78 import SM78
from machine import PWM,Pin,SPI,Timer
import max7219
import utime
import random
import uasyncio
from keypad import Keypad
from controlers import *
from outputs import *
from proof_config import ProofConfig,SetupConfig
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

device_name='big_box'
if('device' in uos.listdir()):
    with open('device','r') as f:
        device_name=f.read().strip()

class Controller():
    def __init__(self):
        self.stop_sign=uasyncio.Event()
        self.stop_sign.set()
        self.box_config=ProofConfig('{}.config'.format(device_name))
        self.setup_config = SetupConfig('setup.config')

        #init timers
        self.frig_timer=Timer(0)
        self.display_timer=Timer(1)
        self.stop_timer=Timer(2)

        #sensros init
        self.sensors=[]
        for sensor in self.box_config.sensors:
            if(sensor[1]=='dht_22'):
                self.sensors.append([sensor[0],dht.DHT22(Pin(int(sensor[2])))])
            elif(sensor[1]=='sm78'):
                self.sensors.append([sensor[0],SM78(tx=int(sensor[2][0]),rx=int(sensor[2][1]),ctl=int(sensor[2][2]))])

        #controlers init
        self.controls=[]
        self.pwr_control=[]
        self.light_control=[]

        self.fan_control=[]
        self.heater_control=[]
        self.humi_control=[]
        self.frig_control=[]

        for p in self.box_config.powers:
            self.pwr_control.append(PwrControl(p))
        for l in self.box_config.lights:
            self.light_control.append(LightControl(l))

        for f in self.box_config.fans:
            self.fan_control.append(FanControl(f,fan_1212,tolerance=self.setup_config.tolerance.get(f[0])))
        for f in self.box_config.frigs:
            self.frig_control.append(FrigControl(f,self.frig_timer,tolerance=self.setup_config.tolerance.get(f[0])))
        for h in self.box_config.heaters:
            self.heater_control.append(HeaterControl(h,tolerance=self.setup_config.tolerance.get(h[0])))
        for h in self.box_config.humis:
            self.humi_control.append(HumiControl(h,tolerance=self.setup_config.tolerance.get(h[0])))


        self.controls.extend(self.fan_control)
        self.controls.extend(self.heater_control)
        self.controls.extend(self.frig_control)
        self.controls.extend(self.humi_control)

        #init outputs
        self.display=max7219.Matrix8x8(self.box_config.displays['sck'],self.box_config.displays['mosi'],self.box_config.displays['cs'],8,self.display_timer)
        # self.peak_output=PeakOutput(self.start_time)
        self.web_output=WebOutput(self.box_config)
        self.web_output.set_config(self.setup_config)
        self.web_output.register_callback(self.on_key_press)
        # self.web_output.start()
        utime.sleep(2)

        #init parameters
        self.start_time=utime.time()
        self.set_mode(self.setup_config.mode) #'cooler','heater'
        self.display.brightness(0)
        self.display.write_txt('     OFF')
        # print('ready')

        #init keypad input
        self.keypad=Keypad(self.box_config.input_keys)
        self.keypad.register_callback(self.on_key_press)

        print('begin to start event loop and tasks')
        self.loop=uasyncio.new_event_loop()
        _tid=_thread.start_new_thread(self.start_background_loop,(self.loop,))
        #start keypad task
        self.keypad.start_task(self.loop,self.stop_sign)
        #start web listener task
        self.web_output.start(self.loop)
        self.web_output.run({'r':not self.stop_sign.is_set(),'mode':self.mode})
        #start power save task
        self.loop.create_task(self.power_save_task())

    def start_background_loop(self,loop) -> None:
        loop.run_forever()

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
        msg['measure']=[]
        msg['status']=[]
        msg['r']=not self.stop_sign.is_set()
        msg['mode']=self.mode
        while(not stop_sign.is_set()):
            msg['t']=utime.time()
            msg['bt']=utime.time()-self.start_time

            msg['measure'].clear()
            for sensor in self.sensors:
                t,h=self.__measure(sensor[1])
                msg['measure'].append([sensor[0],t,h])

            self.run_controls(msg)
            #get controllers status
            msg['status'].clear()
            for c in self.controls:
                msg['status'].append([c.name,c.status])

            msg['tt']=self.setup_config.target_temp
            msg['th']=self.setup_config.target_humi

            #call outputs
            self.display_msg(msg)
            self.output(msg)

            #wait 30 seconds
            await uasyncio.sleep(30)

        msg['r']=not stop_sign.is_set()
        for c in self.controls:
            msg[c.name]=c.status
        self.output(msg)
        print('running thread stopped')


    def display_msg(self,msg):
        if(len(msg['measure'])>=2):
            t1=msg['measure'][0][1]
            t2=msg['measure'][1][1]
            self.display.write_txt(nums_to_str(t1,t2))
        else:
            t1=msg['measure'][0][1]
            h1=msg['measure'][0][2]
            self.display.write_txt(nums_to_str(t1,h1))

    def output(self,msg):
        ct=utime.localtime(msg.get('t'))
        cts='{:02d}:{:02d}:{:02d}'.format(ct[3],ct[4],ct[5])

        print('Curr:{}  From boot:{}'.format(cts ,_sec_to_str(msg.get('bt'))))
        l=''
        for sensor in self.sensors:
           l=l+'  '+sensor[0] + ': ({},{})'.format(msg.get('t_' +sensor[0]),msg.get('h_' + sensor[0]))

        s=''
        for m in msg['status']:
            s=s+'  ' + m[0] + ':{}'.format(m[1])

        print(l )
        print(s )
        # self.peak_output.run(msg,print)
        print(gc.mem_free())
        self.web_output.run(msg)

    def run_controls(self,msg):
        for c in self.controls:
            c.run(msg,[self.setup_config.target_temp,self.setup_config.target_humi,self.mode])

    def switch_light(self):
        for l in self.light_control:
            l.switch()

    def set_mode(self,mode = None):
        if(mode is not None):
            self.mode=mode
            self.setup_config.mode=mode
        if(self.mode=='HEATER'):
            self.setup_config.target_temp=28
            self.setup_config.target_humi=85
        elif(self.mode=='COOLER'):
            self.setup_config.target_temp=2
            self.setup_config.target_humi=None
        else:
            self.setup_config.target_temp=23
            self.setup_config.target_humi=50
        self.display.brightness(2)
        self.display.write_flash_txt('  {}'.format(self.mode))
        self.web_output.set_mode(self.mode)
        self.setup_config.save()

    def switch_mode(self):
        if(self.mode=='COOLER'):
            self.set_mode('HEATER')
        elif(self.mode=='HEATER'):
            self.set_mode('FAN')
        else:
            self.set_mode('COOLER')

    def power_on(self):
        for p in self.pwr_control:
            p.on()
    def power_off(self):
        for p in self.pwr_control:
            p.off()

    def _start(self):
        print('start up')
        self.display.brightness(3)
        self.stop_sign.clear()
        utime.sleep_ms(400)
        try:
            if(self.mode!='FAN'):
                self.display.write_rowing_txt('ON')
            else:
                self.display.write_rowing_txt('OPEN')
        except Exception:
            print('eeee')
            pass
        self.power_on()
        self.start_time=utime.time()
        self.loop.create_task(self._run(self.stop_sign))
        if(self.mode=='FAN'):
            self.stop_timer.deinit()
            self.stop_timer.init(mode=Timer.ONE_SHOT,period=5*60*1000,callback=self._stop)

    def _stop(self,stop_timer=None):
        print('stop')
        if(stop_timer is not None):
            stop_timer.deinit()
        self.stop_sign.set()
        for c in self.controls:
            c.stop()
        self.power_off()
        self.display.brightness(0)
        try:
            self.display.write_rowing_txt('OFF')
        except Exception:
            print('eeee')
        #new after 2022/1/30
        self.display.write_txt('     OFF')

    def check_temp_and_humi_setup(self):
        if(self.mode=='COOLER' and self.setup_config.target_temp>10):
            self.setup_config.target_temp=10
        if(self.mode=='HEATER' and self.setup_config.target_temp<20):
            self.setup_config.target_temp=20
        if(self.mode=='COOLER' and self.setup_config.target_humi is not None):
            self.setup_config.target_humi = None
        if(self.mode=='HEATER' and self.setup_config.target_humi>100):
            self.setup_config.target_humi=100
        if(self.mode=='HEATER' and self.setup_config.target_humi<60):
            self.setup_config.target_humi=60
        self.display.write_flash_txt(nums_to_str(self.setup_config.target_temp,self.setup_config.target_humi))
        self.setup_config.save()

    def on_key_press(self,pressed_keys):
        #if keypressed, then reset power save timer
        self.power_save_check_time=utime.time()
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
                self.setup_config.target_temp=int(pressed_keys[1])
                self.check_temp_and_humi_setup()
            elif('humi_val' == pressed_keys[0]):
                if(self.stop_sign.is_set()):
                    return
                self.setup_config.target_humi=int(pressed_keys[1])
                self.check_temp_and_humi_setup()
            elif('switch_mode'==pressed_keys[0]):
                self.set_mode(pressed_keys[1])
            elif('change_config'==pressed_keys[0]):
                print('on key resoinse:',pressed_keys[1])
                try:
                    self.setup_config=pressed_keys[1]
                    for c in self.controls:
                        c.tolerance=self.setup_config.tolerance.get(c.name)
                    self.web_output.set_config(self.setup_config)
                    self.setup_config.save()
                except Exception as e:
                    print(e)
            elif('temp_up' in pressed_keys and 'humi_down' in pressed_keys):
                if(not self.stop_sign.is_set()):
                    self._stop()
        else:
            if(self.stop_sign.is_set()):
                return
            if('temp_up' in pressed_keys):
                self.setup_config.target_temp+=1
            elif('temp_down' in pressed_keys):
                self.setup_config.target_temp-=1
            elif('humi_up' in pressed_keys):
                if(self.setup_config.target_humi is None):
                    self.setup_config.target_humi=81
                else:
                    self.setup_config.target_humi+=1
            elif('humi_down' in pressed_keys):
                if(self.setup_config.target_humi is None):
                    self.setup_config.target_humi=79
                else:
                    self.setup_config.target_humi-=1
            self.check_temp_and_humi_setup()

    def power_save_task(self):
        self.power_save_check_time=utime.time()
        while(True):
            if(self.stop_sign.is_set()):
                if(utime.time()-self.power_save_check_time>180):
                    #shutdown display
                    self.display.shutdown()
                    #go to light sleep mode, press any key to wake up and resume
                    a=utime.time()
                    self.keypad.sleep_wait()
                    #after wake up, reset power save timer
                    self.power_save_check_time=utime.time()
                    #program result, re init display
                    self.display.init()
                    #init mode and temp setup
                    self.set_mode()
            else:
                # if bread box working, reset power save timer
                self.power_save_check_time=utime.time()
            await uasyncio.sleep(20)


