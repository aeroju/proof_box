
import dht
from machine import PWM,Pin,SPI,WDT,Timer
import machine
import uasyncio
import utime

#sensros pin
up_sensor=14
low_sensor=13

def time_to_str(ct):
    ct=utime.localtime(ct)
    return '{:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}'.format(ct[0],ct[1],ct[2],ct[3],ct[4],ct[5])

def nums_to_str(t1,t2):
    s1 = '{: 05.1f}'.format(t1) if t1 is not None else '    '
    s2 = '{: 05.1f}'.format(t2) if t2 is not None else '    '
    return  s1 + s2

class Main():
    def __init__(self):
        #sensros init
        self.up_sensor=dht.DHT22(Pin(up_sensor))
        self.low_sensor=dht.DHT22(Pin(low_sensor))

    def _run(self,us,ls):
        # wdt=WDT(timeout=10000)

        while(True):
            try:
                us.measure()
                ut=us.temperature()
                uh=us.humidity()
            except:
                ut=None
                uh=None
            uasyncio.sleep_ms(100)
            try:
                ls.measure()
                lt=ls.temperature()
                lh=ls.humidity()
            except:
                lt=None
                lh=None
            msg={'t1':ut,'t2':lt,'h1':uh,'h2':lh,'t':utime.time()}

            #call outputs

            self.output(msg)
            #wait 5 seconds
            # print('lightsleep for 60 secs')
            utime.sleep(5)
            # machine.lightsleep(60000)
            # print('wake up')

    def run(self):
        self._run(self.up_sensor,self.low_sensor)
        pass

    def output(self,msg):
        his_file='his.txt'
        line=[]
        line.append(time_to_str(msg.get('t')))
        line.append(str(msg.get('t1')))
        line.append(str(msg.get('h1')))
        line.append(str(msg.get('t2')))
        line.append(str(msg.get('h2')))
        s='^'.join(line)
        print(s)
        with(open(his_file,'a+')) as fh:
            fh.write(s.join('\r\n') )
