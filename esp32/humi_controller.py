from machine import Timer
import utime

class HumiController():
    def __init__(self,humi_pin):
        self.humi_pin=humi_pin
        self._time=None
        self._last_humi=None

    def _slip_rate(self,curr_humi):
        if(curr_humi is None or curr_humi < 0.01):
            return 1.
        if(self._last_humi is None):
            self._last_humi = curr_humi
            self._time=utime.time()
        elif(utime.time()-self._time>=60):
            if(self._last_humi >0 ):
                return (curr_humi-self._last_humi)/self._last_humi
        return 1.

    @property
    def target_humi(self):
        return self._target_humi

    @target_humi.setter
    def target_humi(self,h):
        self._last_humi=h

    def run(self,curr_temp,curr_humi):
        slip_rate=self._slip_rate(curr_humi)
        if(curr_humi>self.target_humi):
            if(slip_rate>-0.01):
                self.humi_pin.off()
            else:
                self.humi_pin.on()
        else:
            if(slip_rate<0.01):
                self.humi_pin.on()
            else:
                self.humi_pin.off()

        pass

    def stop(self):
        self.humi_pin.off()
