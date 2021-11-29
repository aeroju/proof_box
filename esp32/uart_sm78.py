from machine import UART,Pin
import utime,machine
import _thread

DI=22
DE=21
RO=23

cmd=bytearray(bytes([0x01,0x03,0,0,0,0x02,0xc4,0x0b]))
res=bytearray(bytes([0x01,0x03,0x04]))

class SM78():
    def __init__(self,tx=DI,rx=RO,ctl=DE):
        baudrate=9600
        data_bits=8
        stop_bits=1
        self.uart=UART(1,9600,tx=tx,rx=rx)
        self.uart.init(9600,bits=8,parity=None, stop=1)
        self.control_pin=Pin(ctl,Pin.OUT)
        self.char_time_ms = (1000 * (data_bits + stop_bits + 2)) // baudrate
        self.temp=0
        self.humi=0
        self._write_lock=_thread.allocate_lock()
        # self.runthread=_thread.start_new_thread(self._run,())

    def control(self,s):
        if(s):
            self.control_pin.on()
        else:
            self.control_pin.off()

    def send_cmd(self):
        self.uart.read()
        self.control(1)
        self.uart.write(cmd)
        self.uart.sendbreak()
        utime.sleep_ms(1 + self.char_time_ms)
        self.control(0)
        return self.validate_response()

    def validate_response(self):
        response=bytearray()
        for x in range(1,80):
            if(self.uart.any()):
                response.extend(self.uart.read())
            if(len(response)>=7):
                find_res=False
                for i in range(len(response)-3):
                    if(response[i:i+3]==res):
                        if(len(response[i:])>=7):
                            return response[i:i+7]
                        else:
                            response=response[i:]
                            find_res=True
                            break
                if(not find_res):
                    response=bytearray()
            utime.sleep(0.05)
        return bytearray()

    def _run(self):
        while(True):
            self.measure()
            utime.sleep(5)

    def measure(self):
        data = self.send_cmd()
        if(data is not None and len(data)>0):
            if(self._write_lock.acquire()):
                self.temp=int.from_bytes(data[3:5],'small')/100.
                self.humi=int.from_bytes(data[5:7],'small')/100.
                # print('current temp:{},humi:{}'.format(self.temp,self.humi))
                self._write_lock.release()

    def temperature(self):
        tmp=0
        if(self._write_lock.acquire()):
            tmp=self.temp
            self._write_lock.release()
        return tmp

    def humidity(self):
        tmp=0
        if(self._write_lock.acquire()):
            tmp=self.humi
            self._write_lock.release()
        return tmp

    def get_temp_and_humi(self):
        if(self._write_lock.acquire()):
            tmp=self.temp
            humi=self.humi
            self._write_lock.release()
            return tmp,humi



