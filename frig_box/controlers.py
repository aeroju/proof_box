from machine import Pin,PWM
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

class Controler():
    def __init__(self,pin:Pin,pwm:PWM):
        self.pin=pin
        self.pwm=pwm

    @property
    def status(self):
        return None

    @property
    def name(self):
        return None

    def start(self):
        if(self.pin is not None):
            self.pin.on()

    def stop(self):
        if(self.pin is not None):
            self.pin.off()

    def _check_data(self,t1,t2):
        if(t1 is None and t2 is None):
            return None,None
        t1 = t2 if t1 is None else t1
        t2 = t1 if t2 is None else t2
        return t1,t2

    def _get_temp(self,msg):
        t1,t2=msg.get('t1'),msg.get('t2')
        return self._check_data(t1,t2)

    def _get_humi(self,msg):
        t1,t2=msg.get('h1'),msg.get('h2')
        return self._check_data(t1,t2)

    async def run(self,msg,target):
        pass

    def test(self):
        if(self.pin is not None):
            self.pin.on()
            utime.sleep_ms(100)
            assert self.pin.value()==1
            utime.sleep(1)
            self.pin.off()
            utime.sleep_ms(100)
            assert self.pin.value()==0
        if(self.pwm is not None):
            self.pwm.duty(1024)
            utime.sleep(1)
            self.pwm.duty(0)

class FanControl(Controler):
    def __init__(self,pin:Pin,fan:PwmSetting):
        super().__init__(None,PWM(pin,freq=fan.freq,duty=fan.min_duty))
        self.fan=fan
        self.max_gap=2
        self.min_gap=0.5
        self._speed=None
        self.duty_rates=[self.fan.min_duty]


    @property
    def status(self):
        return self._speed,'Fan Speed at:{}'.format(self._speed)

    @property
    def name(self):
        return 'Fan'

    async def run(self,msg,target):
        t1,t2=self._get_temp(msg)
        if(t1 is None and t2 is None):
            return
        d=self._duty_rate(t1,t2)
        self._speed=d
        print('Fan Duty:',d)
        if(d is not None):
            self.pwm.duty(d)

    def _duty_rate(self,t1,t2):
        ts=abs(t1-t2)
        #上下温差大于2度，风扇全速
        if(ts>self.max_gap):
            return self.fan.max_duty
        #上下温差小于0.5
        if(ts<self.min_gap):
            return self.fan.min_duty
        #温差与转速线性
        r =  int(ts/(self.max_gap)*(self.fan.max_duty-self.fan.min_duty)) + self.fan.min_duty
        #获取阶梯转速
        return self.fan.get_rate(r)

    def duty(self,d):
        if(d<self.fan.min_duty):
            self.pwm.duty(self.fan.min_duty)
        elif(d>self.fan.max_duty):
            self.pwm.duty(self.fan.max_duty)
        else:
            self.pwm.duty(d)


class FrigControl(Controler):
    def __init__(self,pin:Pin):
        super().__init__(pin,None)
        self.last_start=0
        self.last_stop=0
        self.tolerance=2

    @property
    def status(self):
        return 'On' if self.pin.value() else 'Off',\
               'Current Status:{}'.format('On' if self.pin.value() else 'Off')

    @property
    def name(self):
        return 'Frig'

    def start(self):
        ut=utime.time()
        #如果距离上次停止时间小于5分钟，则继续停止
        if(ut-self.last_stop<5*60):
            print('{} seconds after last stop, wait'.format(ut-self.last_stop))
            return
        if(self.pin.value()==0):
            self.last_start=ut
            self.pin.on()
        return

    def stop(self):
        ut=utime.time()
        #如果距离上次启动时间小于5分钟，则继续运行
        if(ut-self.last_start<5*60):
            print('{} seconds after last start, wait'.format(ut-self.last_start))
            return
        if(self.pin.value()==1):
            self.last_stop=ut
            self.pin.off()

    async def run(self,msg,target):
        target = target[0]
        if(target>10):
            self.stop()
            return
        t1,t2=self._get_temp(msg)
        if(t1 is None and t2 is None):
            return
        ave_tmp,min_tmp,max_tmp=(t1+t2)/2,min(t1,t2),max(t1,t2)
        if(ave_tmp < target-self.tolerance):
            self.stop()
        if(ave_tmp > target+self.tolerance):
            self.start()

    def test(self):
        self.start()
        utime.sleep_ms(100)
        assert self.pin.value()==1
        utime.sleep(5)
        self.stop()
        utime.sleep_ms(100)
        assert self.pin.value()==1

heater_tolerance=[10, 8, 0]  #startup value, full power value gap, stop gap
humi_tolerance=[None,5,-1]

class HeaterControl(Controler):
    def __init__(self,pin:Pin ,pwm:PWM, tolerance=None):
        super().__init__(pin,pwm)
        if tolerance is None:
            tolerance = heater_tolerance
        self.tolerance=tolerance
        self._power=0
        self.stop()

    @property
    def status(self):
        return self._power,'Current Power:{}'.format(self._power)

    @property
    def name(self):
        return 'Heater'

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
        r=int((target-t)/8*1023)
        if(self.pin is not None):
            self.pin.on()
        self._power=int(r/1023*100)
        if(self.pwm is not None):
            self.pwm.duty(r)

    def _run(self,t1,t2,target):
        if(t1 is None and t2 is None):
            return
        if(self.tolerance[0] is not None and target<self.tolerance[0]):
            self.stop()
            return
        ave_tmp,min_tmp,max_tmp=(t1+t2)/2,min(t1,t2),max(t1,t2)
        if(ave_tmp < target-self.tolerance[1]):
            self.start()
        elif(ave_tmp > target + self.tolerance[2]):
            self.stop()
        else:
            self.linner(ave_tmp,target)

    async def run(self,msg,target):
        t1,t2 = self._get_temp(msg)
        target=target[0]
        if(target is None):
            return
        self._run(t1,t2,target)

class HumiControl(HeaterControl):
    def __init__(self,pin:Pin,pwm:PWM):
        super().__init__(pin,pwm,humi_tolerance)

    @property
    def name(self):
        return 'Humi'

    async def run(self,msg,target):
        t1,t2=self._get_humi(msg)
        target = target[1]
        if(target is None):
            return
        self._run(t1,t2,target)


class LightControl(Controler):
    def __init__(self,pin:Pin):
        super().__init__(pin,None)
        self._status=0

    @property
    def status(self):
        return 'on' if self._status else 'off','Current Status:{}'.format('on' if self._status else 'off')

    @property
    def name(self):
        return 'Light'

    async def run(self,msg,target):
        pass

    def switch(self):
        self._status=not self._status
        self.pin.value(self._status)
