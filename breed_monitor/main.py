
import _thread
import uasyncio
import machine
import max31865
import utime
from oled_interface import OLED_interface
from outputs import WebOutput
import uos

sensor_sck=12
sensor_mosi=13
sensos_cs=14

oled_scl=18
oled_sda=19

conf_file='conf.txt'

class Main():
    def __init__(self):
        #init display
        self.display=OLED_interface(oled_scl,oled_sda)

        #init sensor
        spi=machine.SPI(1,baudrate=10000000, polarity=1, phase=0,
                            sck=machine.Pin(sensor_sck),
                            mosi=machine.Pin(sensor_mosi))
        self.sensor_in=max31865.MAX31865(spi)
        self.sensor_out=max31865.MAX31865(spi)


        #init output
        self.web_output=WebOutput('Breed Inside Monitor')
        #start instance
        self.loop=uasyncio.new_event_loop()
        self.stop_sign=uasyncio.Event()
        _thread.start_new_thread(self.start_background_loop,(self.loop,))
        self.loop.create_task(self._run())


    def start_background_loop(self,loop) -> None:
        loop.run_forever()

    def read_conf(self):
        if(conf_file in uos.listdir()):
            st=uos.stat(conf_file)
            if(utime.time()-st[8]>3600):
                uos.remove(conf_file)
        start_running_time=utime.time()
        if(conf_file in uos.listdir()):
            with open(conf_file,'r') as f:
                ss=f.read()
                if(ss is not None and len(ss)>0):
                    try:
                        start_running_time=int(ss)
                    except:
                        pass
        return start_running_time

    def write_conf(self,t):
        with open(conf_file,'w') as f:
            f.write(str(t))

    def _run(self):
        msg={}

        start_runing_time=self.read_conf()
        while(not self.stop_sign.is_set()):
            #measure
            curr_t=utime.time()
            msg['tin'] =self.sensor_in.read()
            msg['tout']=self.sensor_out.read()
            msg['t']=utime.localtime(curr_t)
            msg['st']=curr_t-start_runing_time
            #display
            self.display.display_message(msg)
            self.write_conf(curr_t)
            #write to output
            self.web_output.run(msg)
            #wait 2 secs for other action to finished
            await uasyncio.sleep(5)
            #goto light sleep
            machine.lightsleep(55000)
            pass
        print('')