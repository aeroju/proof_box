from machine import Pin, I2C, PWM
import dht
import _thread
import ujson
import uos
import utime
from utils import *

class ProofBoxController():
    def __init__(self,fake=False):
        # self.callbacks=[]
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.read_settings)
        MessageCenter.registe_message_callback(MSG_TYPE_MANUAL_OPERATION,self.on_manual_operation)
        self._status=STATUS_PREPARE
        self._proof_start=utime.time()
        self._status_lock = _thread.allocate_lock()
        self._fake = fake

    # def registe_callback(self,c):
    #     if(c is not None):
    #         self.callbacks.append(c)
    #
    # def remove_callback(self,c):
    #     if(c is not None):
    #         self.callbacks.remove(c)

    @property
    def status(self):
        if(self._status_lock.acquire()):
            try:
                return self._status
            finally:
                self._status_lock.release()

    @status.setter
    def status(self,s):
        if(self._status_lock.acquire()):
            try:
                self._status = int(s)
                if(s==STATUS_PROOFING):
                    self._proof_start=utime.time()
            finally:
                self._status_lock.release()

    @property
    def proof_time(self):
        if(self._status_lock.acquire()):
            try:
                if(self._status==STATUS_PROOFING):
                    return utime.time()-self._proof_start
                else:
                    return 0
            finally:
                self._status_lock.release()

    def on_manual_operation(self,s):
        self.status = s

    def notify_message(self,msg):
        # print(ujson.dumps(msg))
        MessageCenter.notify(MSG_TYPE_CLIENT_STATUS,msg)
        # for c in self.callbacks:
        #     c(msg)

    def start(self):
        self.init_config()
        if(not self._fake):
            self.init_devices()
        self.run_thread = _thread.start_new_thread(self.run,())

    def read_settings(self):
        self.min_temp=int(CONFIG[SETTINGS_MIN_TEMP])
        self.max_temp=int(CONFIG[SETTINGS_MAX_TEMP])
        self.min_humi = int(CONFIG[SETTINGS_MIN_HUMI])
        self.max_humi = int(CONFIG[SETTINGS_MAX_HUMI])

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
        self.humi_controler = Pin(int(CONFIG['humi_pin']),Pin.OUT)
        self.fan_controler  = Pin(int(CONFIG['fan_pin']),Pin.OUT)
        self.inner_fan_controler=PWM(Pin(int(CONFIG['inner_fan_pin'])),freq=100)
        self.inner_fan_controler.duty(int(CONFIG['inner_fan_speed']))

    # def on_setting_change(self):
    #     self.min_temp = CONFIG[SETTINGS_MIN_TEMP]
    #     self.max_temp = CONFIG[SETTINGS_MAX_TEMP]
    #     self.min_humi = CONFIG[SETTINGS_MIN_HUMI]
    #     self.max_humi = CONFIG[SETTINGS_MAX_HUMI]

    def get_temp_and_humi(self):
        if(self._fake):
            return int.from_bytes(uos.urandom(1),'small')/255*10+23,int.from_bytes(uos.urandom(1),'small')/255*15+67
        self.temp_and_humi_sensor.measure()
        return self.temp_and_humi_sensor.temperature(),self.temp_and_humi_sensor.humidity()

    def stop_heating(self):
        if(not self._fake):
            self.heating_controler.off()
        self.is_heating = False

    def start_heating(self):
        if(not self._fake):
            self.heating_controler.on()
        self.is_heating = True

    def stop_humi(self):
        if(not self._fake):
            self.humi_controler.off()
        self.is_humi = False

    def start_humi(self):
        if(not self._fake):
            self.humi_controler.on()
        self.is_humi = True

    def stop_fan(self):
        if(not self._fake):
            self.fan_controler.off()
        self.is_fan = False

    def start_fan(self):
        if(not self._fake):
            self.fan_controler.on()
        self.is_fan = True

    def get_capture_img(self):
        return b''

    def run(self):
        print('Proof Box Control Start')
        # utime.sleep(2)
        count=0
        while(True):
            self.curr_temp,self.curr_humi = self.get_temp_and_humi()
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

            if(self.curr_temp >= self.min_temp and self.curr_temp<=self.max_temp
                and self.curr_humi>=self.min_humi and self.curr_humi<=self.max_humi
                and self.status==STATUS_PREPARE):
                self.status = STATUS_WAITING

            body={'temp':self.curr_temp,'humi':self.curr_humi,'is_heating':self.is_heating,'is_humi':self.is_humi,'is_fan':self.is_fan,'status':self.status,'proof_time':self.proof_time}
            self.notify_message({'type':MSG_TYPE_STATUS,'value':body})
            utime.sleep(30)
            count +=1
            if(count==2):
                buf=self.get_capture_img()
                self.notify_message({'type':MSG_TYPE_CAPTURE,'value':buf})
                count=0








