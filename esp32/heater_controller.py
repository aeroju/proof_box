from machine import Timer

class HeaterController():
    def __init__(self,heater1,heater1_pwm,heater2,low_heater):
        self.heater1_controler=heater1
        self.heater1_pwm=heater1_pwm
        self.heater2_controler=heater2
        self.low_header_control=low_heater
        self.inner_fan_duty=200
        self.heater_timer=Timer(2)
        self.up_edge=True
        self._target_temp=28
        self._status=0

    @property
    def target_temp(self):
        return self._target_temp
    @target_temp.setter
    def target_temp(self,s):
        self._target_temp=s

    @property
    def status(self):
        return self._status
    @status.setter
    def status(self,s):
        self._status=s

    def stop_heating(self,t=None):
        self.heater1_controler.off()
        self.heater1_pwm.duty(0)
        self.heater2_controler.off()
        self.low_header_control.off()
        self.inner_fan_duty=200
        self.status=0
        if(t is not None):
            t.deinit()

    def _linner_control(self,gap):
        if(gap>=8):
            self.heater1_controler.on()
            self.heater2_controler.on()
            self.low_header_control.on()
            self.heater1_pwm.duty(100)
        elif(gap>0 and gap<8):
            self.heater2_controler.off()
            self.heater1_controler.on()
            self.heater1_pwm.duty(int(gap/8*100))
            self.low_header_control.on()
        else:
            self.stop_heating()

    def run(self,temp,humi):
        gap=self.target_temp-temp
        self._linner_control(gap)

    def _stepped_control(self,gap):
        if(gap>=8):
            self.heater1_controler.on()
            self.heater1_pwm.duty(100)
            self.heater2_controler.on()
            self.low_header_control.on()
            self.status = 3
            self.inner_fan_duty=800
            # self._heater_timer.init(mode=Timer.ONE_SHOT,period=8000,callback=self.stop_heating)
        elif(gap>=3.5):
            self.heater1_controler.on()
            self.heater1_pwm.duty(100)
            self.heater2_controler.off()
            self.low_header_control.on()
            self.status = 2
            self.inner_fan_duty=600
            # self._heater_timer.init(mode=Timer.ONE_SHOT,period=6000,callback=self.stop_heating)
        elif(gap>=2):
            self.heater1_controler.on()
            self.heater1_pwm.duty(50)
            self.heater2_controler.off()
            self.low_header_control.on()
            self.status = 2
            self.inner_fan_duty=600
            # self.heater_timer.init(mode=Timer.ONE_SHOT,period=4000,callback=self.stop_heating)
        elif(gap<0):
            self.up_edge=False
            self.stop_heating()
        else:
            if(self.up_edge):
                if(gap>=0.5):
                    self.heater1_controler.off()
                    self.heater2_controler.off()
                    self.low_header_control.on()
                    self.status = 1
                    self.inner_fan_duty=400
            else:
                if(gap>1.0):
                    self.heater1_controler.on()
                    self.heater2_controler.off()
                    self.low_header_control.on()
                    self.status=2
                    self.inner_fan_duty=400
                    self.heater_timer.init(mode=Timer.ONE_SHOT,period=4000,callback=self.stop_heating)
                elif(gap>=0.5):
                    self.low_header_control.on()
                    self.heater1_controler.off()
                    self.heater2_controler.off()
                    self.inner_fan_duty=200
                    self.status=1
                else:
                    self.stop_heating()