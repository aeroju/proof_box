
import ubluetooth
import struct
import utime
import ujson
import struct
from micropython import const
_IRQ_CENTRAL_CONNECT                 = const(1 << 0)
_IRQ_CENTRAL_DISCONNECT              = const(1 << 1)

class ProofBoxBLE():
    def __init__(self):
        self._ble = ubluetooth.BLE()
        self.set_temp_and_humi=None
        self.set_proof_metrial=None
        pass

    #小程序操作命令
    #命令是json格式：{'cmd':x,'value':y}
    #START(0)，启动
    #STOP(1)，停止
    #SET_TEMP_AND_HUMI(5)，设置温度和湿度范围
    #SET_METARIAL(6),设置发酵面团
    def on_gatt_write(self,handler):
        buf = self._ble.gatts_read(handler)
        cmd = ujson.loads(buf.decode('utf8'))

        pass

    def notify_status(self,curr_temp,curr_humi,is_heating,is_humi,is_fan):
        status=ujson.dumps({'t':curr_temp,'h':curr_humi,'ih':is_heating,'iu':is_humi,'if':is_fan})
        for conn in self.connections:
            self._ble.gatts.write(conn,status.encode('utf8'))
        pass