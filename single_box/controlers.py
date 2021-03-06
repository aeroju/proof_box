from machine import Pin,PWM,Timer
import utime

class PwmSetting():
    def __init__(self,freq,min_duty,max_duty,stop_duty):
        self.freq=freq
        self.min_duty=min_duty
        self.max_duty=max_duty
        self.stop_duty=stop_duty
        self.duty_rates=[]
        drs=5
        step=int((self.max_duty-self.min_duty)/drs)
        for i in range(5):
            self.duty_rates.append(self.min_duty + i*step)
        self.duty_rates.append(self.max_duty)

    def get_rate(self,r):
        if(r<self.min_duty):
            return self.min_duty
        if(r>self.max_duty):
            return self.max_duty

        for i in range(len(self.duty_rates)):
            if(i<=len(self.duty_rates)-1):
                if(self.duty_rates[i]<r and r<self.duty_rates[i+1]):
                    return self.duty_rates[i+1]
        return self.min_duty

class Controler():
    def __init__(self,ctl,tolerance):
        if(isinstance(ctl,list)):
            self._name=ctl[0]
            pin=ctl[1]
        else:
            self._name='unknown'
            pin=ctl
        self.pin=None
        self.pwm=None
        if(isinstance(pin,str)):
            if(pin.find(':')>0):
                type,n=pin.split(':')
                if(type.upper()=='PIN'):
                    self.pin=Pin(int(n),Pin.OUT)
                elif(type.upper()=='PWM'):
                    self.pin=Pin(int(n))
                    self.pwm=PWM(self.pin)
                else:
                    raise Exception('Wrong type of pin, only except Pin and PWM',pin)
            else:
                raise Exception('Wrong type of pin, pin should like Pin:4 or Pwm:18', pin)
        elif(isinstance(pin,int)):
            self.pin=Pin(pin)
        else:
            raise Exception('Wrong type of pin, only except int and str:',pin)
        if(tolerance is None):
            self._tolerance=[None,5,0]
        else:
            self._tolerance=tolerance

    @property
    def status(self):
        return None

    @property
    def name(self):
        return self._name

    @property
    def tolerance(self):
        return self._tolerance

    @tolerance.setter
    def tolerance(self,v):
        self._tolerance=v

    def start(self):
        if(self.pin is not None):
            self.pin.on()
        if(self.pwm is not None):
            self.pwm.duty(1023)

    def stop(self):
        if(self.pin is not None):
            self.pin.off()
        if(self.pwm is not None):
            self.pwm.duty(0)

    def _get_temp(self,msg):
        t=[]
        for m in msg['measure']:
            if(m[1] is not None):
                t.append(m[1])
        return t

    def _get_ave_tmp(self,msg):
        ts=self._get_temp(msg)
        if(len(ts)==0):
            return None
        _ave=0
        for t in ts:
            _ave+=t
        return _ave/len(ts)

    def _get_humi(self,msg):
        t=[]
        for m in msg['measure']:
            if(m[2] is not None):
                t.append(m[2])
        return t

    def _get_ave_humi(self,msg):
        ts=self._get_humi(msg)
        if(len(ts)==0):
            return None
        _ave=0
        for t in ts:
            _ave+=t
        return _ave/len(ts)

    def _get_gap(self,ts):
        return max(ts)-min(ts)

    def run(self,msg,target):
        pass

class PwrControl(Controler):
    def __init__(self,pin):
        super().__init__(pin,None)

    def on(self):
        self.pin.on()

    def off(self):
        self.pin.off()

class FanControl(Controler):
    def __init__(self,pin,fan,tolerance):
        super().__init__(pin,tolerance)
        self.fan=fan
        self._speed=1023

    @property
    def status(self):
        return self._speed

    def run(self,msg,target):
        if(len(self._get_temp(msg))==0 or self._get_humi(msg)==0):
            self.stop()
            self._speed=0
            return
        inner_temp_gap=self._get_gap(self._get_temp(msg))
        d=self._duty_rate(inner_temp_gap)

        ave_temp_gap=self._get_ave_tmp(msg)-target[0]
        ave_humi_gap=(self._get_ave_humi(msg)-target[1]) if target[1] is not None else 0
        if(ave_humi_gap>0 and ave_temp_gap>0):
            d=self._duty_rate(max([ave_temp_gap,ave_humi_gap]))

        self._speed=d if d >=self.fan.min_duty and d<=self.fan.max_duty else self.fan.min_duty
        self.pwm.duty(self._speed)

    def _duty_rate(self,tm):
        if(self.tolerance[1]==-1 and self.tolerance[2]==-1):
            return self.fan.max_duty
        if(self.tolerance[1]==-2 and self.tolerance[2]==-2):
            return self.fan.min_duty
        #??????????????????2??????????????????
        if(tm>self.tolerance[1]):
            return self.fan.max_duty
        #??????????????????0.5
        if(tm<self.tolerance[2]):
            return self.fan.min_duty
        #?????????????????????
        r =  int(tm/(self.tolerance[2])*(self.fan.max_duty-self.fan.min_duty)) + self.fan.min_duty
        return r
        #??????????????????
        # return self.fan.get_rate(r)

    def duty(self,d):
        if(d<self.fan.min_duty):
            self.pwm.duty(self.fan.min_duty)
        elif(d>self.fan.max_duty):
            self.pwm.duty(self.fan.max_duty)
        else:
            self.pwm.duty(d)


class FrigControl(Controler):
    def __init__(self,pin,stop_timer:Timer,tolerance):
        super().__init__(pin,tolerance)
        self.last_start=0
        self.last_stop=0
        self.last_op = 0
        self.pin.off()
        self.stop_timer=stop_timer

    @property
    def status(self):
        return 'On' if self.pin.value() else 'Off'

    def start(self):
        ut=utime.time()
        #????????????????????????????????????5????????????????????????
        if(ut-self.last_op<10*60):
            print('{} seconds after last operation, wait'.format(ut-self.last_op))
            return
        if(self.pin.value()==0):
            print('frig start')
            self.last_op=ut
            self.pin.on()
        else:
            print('frig is running for {} s'.format(ut-self.last_op))
            # self.stop_timer.deinit()
        return

    def _timer_callback(self,t):
        t.deinit()
        self.stop()

    def stop(self):
        ut=utime.time()
        #????????????????????????????????????5????????????????????????
        if(ut-self.last_op<5*60):
            print('{} seconds after last operation, wait'.format(ut-self.last_op))
            return
        # if(self.last_start>0):
        #     print('running time of frig:{} secs'.format(ut-self.last_start))
        # if(ut-self.last_start<5*60):
        #     to_st=5*60+10-(ut-self.last_start)
        #     print('{} secs after last start, stop timer setup for {} secs'.format(ut-self.last_start,to_st))
        #     self.stop_timer.deinit()
        #     self.stop_timer.init(mode=Timer.ONE_SHOT, period=to_st*1000, callback=self._timer_callback)
        #     return
        if(self.pin.value()==1):
            print('frig stop')
            self.last_op=ut
            self.pin.off()
        else:
            print('frig stopped for {} s'.format(ut-self.last_op))
        return

    def run(self,msg,target):
        if(target[2] !='COOLER'):
            return
        # if(target[0]>10):
        #     self.stop()
        #     return
        ave_tmp=self._get_ave_tmp(msg)
        if(ave_tmp is None):
            self.stop()
            return
        if(ave_tmp < target[0]-self.tolerance[1]):
            self.stop()
        if(ave_tmp > target[0]+self.tolerance[1]):
            self.start()

    def test(self):
        self.start()
        utime.sleep_ms(100)
        assert self.pin.value()==1
        utime.sleep(5)
        self.stop()
        utime.sleep_ms(100)
        assert self.pin.value()==1

# heater_tolerance=[None, 5, 0.1]  #startup value, full power value gap, stop gap
# humi_tolerance=[None,20,-5]

class HeaterControl(Controler):
    def __init__(self,pin,tolerance):
        super().__init__(pin,tolerance)
        self._power=0
        self.stop()

    @property
    def status(self):
        return self._power

    def start(self):
        if(self.pin is not None):
            self.pin.on()
        self._power=100
        if(self.pwm is not None):
            self.pwm.duty(1023)

    def stop(self):
        if(self.pin is not None):
            self.pin.off()
        self._power=0
        if(self.pwm is not None):
            self.pwm.duty(0)

    def linner(self,t,target):
        if(self.pin is not None):
            self.start()
        if(self.pwm is not None):
            r=int((target-t)/(self.tolerance[1])*1023)
            self._power=int(r/1023*100)
            self.pwm.duty(r)

    def _run(self,ave_tmp,target):
        if(ave_tmp is None):
            self.stop()
            return
        if(self.tolerance[0] is not None and target<self.tolerance[0]):
            self.stop()
            return
        if(ave_tmp < target-self.tolerance[1]):
            self.start()
        elif(ave_tmp > target + self.tolerance[2]):
            self.stop()
        else:
            self.linner(ave_tmp,target)

    def run(self,msg,target):
        if(target[2] !='HEATER'):
            return
        ave_tmp= self._get_ave_tmp(msg)
        target=target[0]
        if(target is None):
            return
        self._run(ave_tmp,target)

class HumiControl(HeaterControl):
    def __init__(self,pin,tolerance):
        super().__init__(pin,tolerance)

    def run(self,msg,target):
        if(target[2] !='HEATER'):
            return
        ave_humi=self._get_ave_humi(msg)
        target = target[1]
        if(target is None):
            return
        self._run(ave_humi,target)


class LightControl(Controler):
    def __init__(self,pin):
        super().__init__(pin,None)
        self._status=0

    @property
    def status(self):
        return 'on' if self._status else 'off'

    def switch(self):
        self._status=not self._status
        self.pin.value(self._status)
