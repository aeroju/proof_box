
import dht
import uos
import _thread
from machine import Pin,PWM,Timer,TouchPad
from uart_sm78 import SM78
import utime
from utils import *
from message_center import MessageCenter,Event
from heater_controller import HeaterController
from humi_controller import HumiController




class ProofBoxController():
    def __init__(self,fake=False):
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_change_settings)
        MessageCenter.registe_message_callback(MSG_TYPE_MANUAL_OPERATION,self.on_manual_control)
        self._proof_start=utime.time()
        self._proof_status=-1
        self._proof_status_lock=_thread.allocate_lock()
        self.heater_control = None
        self.humi_controler = None
        self._fake = fake
        self._inner_fan_status = 0
        self.status=TARGET_JM
        self._light_status=False
        self._stop_sign=Event()

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
                if(val in [TARGET_JM,TARGET_F1,TARGET_F2]):
                    self._proof_status=val
                    self._proof_start = utime.time()
                    self.init_settings(JM_SETTING if val == TARGET_JM else F1_SETTING if val==TARGET_F1 else F2_SETTING if val==TARGET_F2 else JM_SETTING)
            finally:
                self._proof_status_lock.release()

    def on_manual_control(self,pm):
        if(pm==OPERATION_BEGIN_POWER_DOWN):
            self.shutdown()
        elif(pm==OPERATION_SWITCH_LIGHT):
            self.switch_light()

    def on_change_settings(self,msg):
        target_type=TARGET_JM if msg.get('target_type') is None else msg.get('target_type')
        settings=JM_SETTING if msg.get('settings') is None else msg.get('settings')
        self.status=target_type
        self.init_settings(settings)

    def notify_message(self,msg):
        MessageCenter.notify(MSG_TYPE_CLIENT_STATUS,msg)

    def start(self):
        self.init_config(self.status)
        if(not self._fake):
            self.init_devices()
        self.run_thread = _thread.start_new_thread(self.run,(self._stop_sign,))
        # self.init_light_controler()

    def init_settings(self,settings):
        self.target_temp=settings['target_temp']
        self.target_humi=settings['target_humi']
        temp_tolerence=[-1,1] if settings.get('temp_tolerence') is None else settings.get('temp_tolerence')
        humi_tolerence=[-5,5] if settings.get('humi_tolerence') is None else settings.get('humi_tolerence')
        self.min_temp=self.target_temp+temp_tolerence[0]
        self.max_temp=self.target_temp+temp_tolerence[1]
        self.min_humi = self.target_humi + humi_tolerence[0]
        self.max_humi = self.target_humi + humi_tolerence[1]
        if(self.heater_control is not None):
            self.heater_control.target_temp=self.target_temp
        if(self.humi_controler is not None):
            self.humi_controler.target_humi=self.target_humi
        # print('{},{},{},{}',self.min_temp,self.max_temp,self.min_humi,self.max_humi)

    def init_config(self,target_type):
        msg = {'type':MSG_TYPE_INIT,'value':'init config'}
        self.notify_message(msg)
        self.init_settings(JM_SETTING if target_type == TARGET_JM else F1_SETTING if target_type==TARGET_F1 else F2_SETTING if target_type==TARGET_F2 else JM_SETTING)
        self._is_heating = False
        self.is_fan = False
        self.is_humi = False
        self.curr_temp = 23
        self.curr_humi = 65

    def init_devices(self):
        msg = {'type':MSG_TYPE_INIT,'value':'init devices'}
        self.notify_message(msg)
        # self.temp_and_humi_sensor = dht.DHT22(Pin(int(CONFIG['sensor_pin'])))
        self.temp_and_humi_sensor=SM78(tx=int(CONFIG['sm78_tx']),rx=int(CONFIG['sm78_rx']),ctl=int(CONFIG['sm78_ctl']))
        self.heater_control=HeaterController(Pin(int(CONFIG['heater1_pin']),Pin.OUT),
                                             PWM(Pin(int(CONFIG['heater1_pwm'])),freq=100),
                                             Pin(int(CONFIG['heater2_pin']),Pin.OUT),
                                             Pin(int(CONFIG['low_heater_pin']),Pin.OUT))
        self.heater_control.target_temp=self.target_temp
        self.inner_fan_duty=200
        self.humi_controler =HumiController( Pin(int(CONFIG['humi_pin']),Pin.OUT))
        self.humi_controler.target_humi=self.target_humi
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

    def stop_inner_fan(self,t=None):
        if(not self._fake):
            self.inner_fan_pwm_controler.duty(0)
        if(t is not None):
            t.deinit()

    def start_inner_fan(self,is_auto=True,duty=800):
        if(not self._fake):
            self.inner_fan_pwm_controler.duty(duty)
            if(is_auto):
                self._inner_fan_timer.init(mode=Timer.ONE_SHOT,period=8000,callback=self.stop_inner_fan)

    def invert_inner_fan(self):
        if(self._inner_fan_status>=2):
            self.start_inner_fan(is_auto=True,duty=self.inner_fan_duty)
            self._inner_fan_status=0
        else:
            self.stop_inner_fan()
        self._inner_fan_status +=1

    def stop_fan(self,t = None):
        if(not self._fake):
            self.fan_controler.duty(0)
        if(t is not None):
            t.deinit()
        self.is_fan = False

    def start_fan(self,is_auto=True,duty=100):
        if(not self._fake):
            self.fan_controler.duty(800)
            if(is_auto):
                self._fan_timer.init(mode=Timer.ONE_SHOT,period=4000,callback=self.stop_fan)
        self.is_fan = True

    def drain(self):
        self.humi_controler.stop()
        self.heater_control.stop_heating()
        self.start_inner_fan(False,duty=1000)
        self.start_fan(False,duty=1000)
        self.inner_light_pin.off()
        low_humi=0
        max_drain=0
        drain_start = utime.time()
        while(True):
            self.curr_temp,self.curr_humi = self.get_temp_and_humi()
            if(self.curr_humi<70):
                low_humi=low_humi+1
            if(low_humi>12 or max_drain>=120): #humi low than 70 for 1 minutes or drain for 10 minutes
                self.stop_fan()
                self.stop_inner_fan()
                MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_POWER_DOWN)
                break
            else:
                body={'temp':self.curr_temp,'humi':self.curr_humi,'is_heating':False,'is_humi':False,'is_fan':True,'status':-1,'proof_time':(utime.time()-drain_start)}
                self.notify_message({'type':MSG_TYPE_STATUS,'value':body})
            utime.sleep(5)
            max_drain+=1

    def fan_control(self):
        if(self.curr_humi>self.max_humi):
            self.start_fan()
        else:
            if(self.curr_temp>self.max_temp and self.curr_humi-self.target_humi>-10):
                self.start_fan()
            else:
                self.stop_fan()

    def inner_fan_control(self):
        self.inner_fan_duty=self.heater_control.inner_fan_duty
        self.invert_inner_fan()

    def switch_light(self):
        self.light_status=not self._light_status
        self.inner_light_pin.value(self._light_status)

    def proof_control(self,proof_material):
        self.curr_temp,self.curr_humi = self.get_temp_and_humi()
        self.heater_control.run(self.curr_temp,self.curr_humi)
        self.humi_controler.run(self.curr_temp,self.curr_humi)

        self.inner_fan_control()
        self.fan_control()

        body={'temp':self.curr_temp,'humi':self.curr_humi,'is_heating':self.heater_control.status,'is_humi':self.is_humi,'is_fan':self.is_fan,'status':proof_material,'proof_time':self.proof_time}
        self.notify_message({'type':MSG_TYPE_STATUS,'value':body})

    def run(self,_stop_sign):
        print('Proof Box Control Start')
        # self.status=STATUS_PROOFING
        # _wdt = WDT(timeout=30000)
        while(not _stop_sign.is_set()):
            self.proof_control(self.status)
            utime.sleep(10)

    def shutdown(self):
        self._stop_sign.set()
        utime.sleep(11)
        self.drain()
