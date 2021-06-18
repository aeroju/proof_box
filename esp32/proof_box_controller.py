
import dht
import uos
import _thread
from machine import Pin,PWM,Timer,TouchPad
import utime
from utils import *
from message_center import MessageCenter

class ProofBoxController():
    def __init__(self,fake=False):
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.read_settings)
        MessageCenter.registe_message_callback(MSG_TYPE_MANUAL_OPERATION,self.change_proof_material)
        self._proof_start=utime.time()
        self._proof_status=-1
        self._proof_status_lock=_thread.allocate_lock()
        self.status=STATUS_PROOFING_JM
        self._fake = fake
        self._inner_fan_status = 0

    @property
    def proof_time(self):
        if(self._proof_status_lock.acquire()):
            try:
                return utime.time()-self._proof_start
            finally:
                self._proof_status_lock.release()

    @property
    def status(self):
        if(self._proof_status_lock.acquire()):
            try:
                return self._proof_status
            finally:
                self._proof_status_lock.release()

    @status.setter
    def status(self,val):
        if(self._proof_status_lock.acquire()):
            try:
                if(val>0 and val!=self._proof_status):
                    if(val==STATUS_PROOFING_JM):
                        CONFIG[SETTINGS_TARGET_TEMP]=25
                        CONFIG[SETTINGS_TARGET_HUMI]=80
                    elif(val==STATUS_PROOFING_1F):
                        CONFIG[SETTINGS_TARGET_TEMP]=28
                        CONFIG[SETTINGS_TARGET_HUMI]=85
                        pass
                    elif(val==STATUS_PROOFING_2F):
                        CONFIG[SETTINGS_TARGET_TEMP]=33
                        CONFIG[SETTINGS_TARGET_HUMI]=90
                        pass
                    self._proof_status=val
                    self._proof_start = utime.time()
                    self.read_settings()
                else:
                    self._proof_status=val
                    print('controller into shutdown status')
            finally:
                self._proof_status_lock.release()

    def change_proof_material(self,pm):
        if(pm>0):
            self.status=pm
            MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,None)

    def notify_message(self,msg):
        MessageCenter.notify(MSG_TYPE_CLIENT_STATUS,msg)

    def start(self):
        self.init_config()
        if(not self._fake):
            self.init_devices()
        self.run_thread = _thread.start_new_thread(self.run,())
        # self.init_light_controler()

    def read_settings(self):
        self.target_temp=int(CONFIG[SETTINGS_TARGET_TEMP])
        self.target_humi=int(CONFIG[SETTINGS_TARGET_HUMI])
        self.min_temp=self.target_temp + 0.2
        self.max_temp=(self.target_temp+1.2) if (self.target_temp+1.2)<=40 else 40
        self.min_humi = self.target_humi
        self.max_humi = (self.target_humi+5) if (self.target_humi+5<=100) else 100
        # print('{},{},{},{}',self.min_temp,self.max_temp,self.min_humi,self.max_humi)

    def init_config(self):
        msg = {'type':MSG_TYPE_INIT,'value':'init config'}
        self.notify_message(msg)
        self.read_settings()
        self.is_heating = False
        self.is_fan = False
        self.is_humi = False
        self.curr_temp = 23
        self.curr_humi = 65

    def init_devices(self):
        msg = {'type':MSG_TYPE_INIT,'value':'init devices'}
        self.notify_message(msg)
        self.temp_and_humi_sensor = dht.DHT22(Pin(int(CONFIG['sensor_pin'])))
        self.heating_controler = Pin(int(CONFIG['heater_pin']),Pin.OUT)
        self.ex_heating_controler=Pin(int(CONFIG['ex_heater_pin']),Pin.OUT)
        self.humi_controler = Pin(int(CONFIG['humi_pin']),Pin.OUT)
        self.fan_controler  = PWM(Pin(int(CONFIG['fan_pin'])),freq=100)
        self.fan_controler.duty(0)
        self._fan_timer = Timer(0)
        self.inner_fan_pwm_controler=PWM(Pin(int(CONFIG['inner_fan_pwm_pin'])),freq=100)
        self.inner_fan_pwm_controler.duty(200)
        self._inner_fan_timer = Timer(1)
        self.inner_light_pin=Pin(int(CONFIG['inner_light_pin']),Pin.OUT)

    def get_temp_and_humi(self):
        if(self._fake):
            return int.from_bytes(uos.urandom(1),'small')/255*10+23,int.from_bytes(uos.urandom(1),'small')/255*15+67
        try:
            self.temp_and_humi_sensor.measure()
        except Exception:
            pass
        return self.temp_and_humi_sensor.temperature(),self.temp_and_humi_sensor.humidity()

    def stop_heating(self):
        if(not self._fake):
            self.heating_controler.off()
            self.ex_heating_controler.off()
        self.is_heating = False

    def start_heating(self):
        if(not self._fake):
            self.heating_controler.on()
            self.ex_heating_controler.on()
        self.is_heating = True

    def stop_inner_fan(self,t=None):
        if(not self._fake):
            self.inner_fan_pwm_controler.duty(0)
        if(t is not None):
            t.deinit()

    def start_inner_fan(self,is_auto=True,duty=200):
        if(not self._fake):
            self.inner_fan_pwm_controler.duty(duty)
            if(is_auto):
                self._inner_fan_timer.init(mode=Timer.ONE_SHOT,period=4000,callback=self.stop_inner_fan)

    def invert_inner_fan(self):
        if(self._inner_fan_status>9):
            self.start_inner_fan()
            self._inner_fan_status=0
        else:
            self.stop_inner_fan()
        self._inner_fan_status +=1

    def stop_humi(self):
        if(not self._fake):
            self.humi_controler.off()
        self.is_humi = False

    def start_humi(self):
        if(not self._fake):
            self.humi_controler.on()
        self.is_humi = True

    def stop_fan(self,t = None):
        if(not self._fake):
            self.fan_controler.duty(0)
        if(t is not None):
            t.deinit()
        self.is_fan = False

    def start_fan(self,is_auto=True,duty=100):
        if(not self._fake):
            self.fan_controler.duty(200)
            if(is_auto):
                self._fan_timer.init(mode=Timer.ONE_SHOT,period=4000,callback=self.stop_fan)
        self.is_fan = True

    def drain(self):
        self.stop_humi()
        self.stop_heating()
        self.start_inner_fan(False,duty=1000)
        self.start_fan(False,duty=1000)
        self.inner_light_pin.off()
        low_humi=0
        drain_start = utime.time()
        while(True):
            self.curr_temp,self.curr_humi = self.get_temp_and_humi()
            if(self.curr_humi<64):
                low_humi=low_humi+1
            if(low_humi>12):
                self.stop_fan()
                self.stop_inner_fan()
                MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_POWER_DOWN)
                break
            else:
                body={'temp':self.curr_temp,'humi':self.curr_humi,'is_heating':False,'is_humi':False,'is_fan':True,'status':STATUS_SHUTTING_DOWN,'proof_time':(utime.time()-drain_start)}
                self.notify_message({'type':MSG_TYPE_STATUS,'value':body})
            utime.sleep(5)

    def proof_control(self,proof_material):
        self.curr_temp,self.curr_humi = self.get_temp_and_humi()
        self.invert_inner_fan()
        if(self.curr_temp>self.min_temp):
            self.stop_heating()
        else:
            self.start_heating()
        if(self.curr_humi>self.min_humi):
            self.stop_humi()
        else:
            self.start_humi()
        if(self.curr_temp>self.max_temp or self.curr_humi>self.max_humi):
            self.start_fan()
        else:
            self.stop_fan()

        body={'temp':self.curr_temp,'humi':self.curr_humi,'is_heating':self.is_heating,'is_humi':self.is_humi,'is_fan':self.is_fan,'status':proof_material,'proof_time':self.proof_time}
        self.notify_message({'type':MSG_TYPE_STATUS,'value':body})

    def run(self):
        print('Proof Box Control Start')
        # self.status=STATUS_PROOFING
        # _wdt = WDT(timeout=30000)
        while(True):
            cs=self.status
            if(cs>0):
                self.proof_control(cs)
                utime.sleep(10)
            elif(cs==STATUS_SHUTTING_DOWN):
                self.drain()
                break









