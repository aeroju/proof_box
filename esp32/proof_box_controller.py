
import dht
import uos
import _thread
from machine import Pin,PWM,Timer,WDT,TouchPad
import utime
from utils import *

class ProofBoxController():
    def __init__(self,fake=False):
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.read_settings)
        self._proof_start=utime.time()
        self._fake = fake
        self._inner_fan_status = 0

    @property
    def proof_time(self):
        return utime.time()-self._proof_start

    def notify_message(self,msg):
        MessageCenter.notify(MSG_TYPE_CLIENT_STATUS,msg)

    def start(self):
        self.init_config()
        if(not self._fake):
            self.init_devices()
        self.run_thread = _thread.start_new_thread(self.run,())
        self.init_light_controler()

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
        self._fan_timer = Timer(0)
        self.inner_fan_pwm_controler=PWM(Pin(int(CONFIG['inner_fan_pwm_pin'])),freq=100)
        self.inner_fan_pwm_controler.duty(int(CONFIG['inner_fan_speed']))
        self._inner_fan_timer = Timer(1)

    def init_light_controler(self):
        self.inner_light_pin=Pin(int(CONFIG['inner_light_pin']),Pin.OUT)

        self._light_control_thread=_thread.start_new_thread(self.touch_control,())

    def touch_control(self):
        light_status=False
        t=0
        touch_pad=TouchPad(Pin(int(CONFIG['inner_light_control_pin'])))
        while(True):
            if(touch_pad.read()<200):
                t=t+1
            else:
                if(t>0):
                    if(t<=3):
                        if(light_status):
                            self.inner_light_pin.off()
                        else:
                            self.inner_light_pin.on()
                        light_status=not light_status
                    elif(t>=6):
                        touch_pad.config(300)
                        import esp32
                        esp32.wake_on_touch(True)
                        MessageCenter.notify(MSG_TYPE_MANUAL_OPERATION,OPERATION_POWER_DOWN)
                    t=0

            utime.sleep_ms(500)

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
        self.is_heating = False

    def start_heating(self):
        if(not self._fake):
            self.heating_controler.on()
        self.is_heating = True

    def stop_inner_fan(self,t=None):
        if(not self._fake):
            self.inner_fan_pwm_controler.duty(0)
        if(t is not None):
            t.deinit()

    def start_inner_fan(self):
        if(not self._fake):
            self.inner_fan_pwm_controler.duty(int(CONFIG['inner_fan_speed']))
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
            self.fan_controler.off()
        if(t is not None):
            t.deinit()
        self.is_fan = False

    def start_fan(self):
        if(not self._fake):
            self.fan_controler.on()
            self._fan_timer.init(mode=Timer.ONE_SHOT,period=2000,callback=self.stop_fan)
        self.is_fan = True

    def get_capture_img(self):
        return b''

    def run(self):
        print('Proof Box Control Start')
        # self.status=STATUS_PROOFING
        # _wdt = WDT(timeout=30000)
        while(True):
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

            body={'temp':self.curr_temp,'humi':self.curr_humi,'is_heating':self.is_heating,'is_humi':self.is_humi,'is_fan':self.is_fan,'status':STATUS_PROOFING,'proof_time':self.proof_time}
            self.notify_message({'type':MSG_TYPE_STATUS,'value':body})
            # _wdt.feed()
            utime.sleep(10)






