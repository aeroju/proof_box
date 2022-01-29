import ubluetooth
import struct
import utime
import json

from micropython import const
_IRQ_CENTRAL_CONNECT                 = const(1)
_IRQ_CENTRAL_DISCONNECT              = const(2)
_IRQ_GATTS_WRITE                     = const(3)

# org.bluetooth.service.environmental_sensing
_BREAD_BOX_UUID             = ubluetooth.UUID(0x1818)

_BREAD_BOX_STATUS_CHAR      = (ubluetooth.UUID(0x2A5D), ubluetooth.FLAG_READ,)
_BREAD_BOX_CONTROL_CHAR     = (ubluetooth.UUID(0x2A65), ubluetooth.FLAG_WRITE,)
_BREAD_BOX_INIT_CHAR        = (ubluetooth.UUID(0x2A65), ubluetooth.FLAG_READ,)

# _BREAD_BOX_MEASUREMENT_DESC1= (ubluetooth.UUID(0x2902),0)
# _BREAD_BOX_MEASUREMENT_DESC2= (ubluetooth.UUID(0x2903),0)
# _BREAD_BOX_MEASUREMENT_CHAR = (ubluetooth.UUID(0x2A63), ubluetooth.FLAG_READ|ubluetooth.FLAG_NOTIFY,(_BREAD_BOX_MEASUREMENT_DESC1,_BREAD_BOX_MEASUREMENT_DESC2,))

_BREAD_BOX_SERVICE          = (_BREAD_BOX_UUID, (_BREAD_BOX_INIT_CHAR,_BREAD_BOX_STATUS_CHAR,_BREAD_BOX_CONTROL_CHAR ,),)

_ADV_TYPE_FLAGS = const(0x01)
_ADV_TYPE_NAME = const(0x09)
_ADV_TYPE_UUID16_COMPLETE = const(0x3)
_ADV_TYPE_UUID32_COMPLETE = const(0x5)
_ADV_TYPE_UUID128_COMPLETE = const(0x7)
_ADV_TYPE_UUID16_MORE = const(0x2)
_ADV_TYPE_UUID32_MORE = const(0x4)
_ADV_TYPE_UUID128_MORE = const(0x6)
_ADV_TYPE_APPEARANCE = const(0x19)

_ADV_APPEARANCE_BREAD_BOX = 1156

def writeUInt16LE(buffer, value, offset):
    struct.pack_into("<H", buffer, offset, value)

def writeUInt16BE(buffer, value, offset):
    struct.pack_into(">H", buffer, offset, value)

class BLEOutput():
    def __init__(self,service_name='Bread Box'):
        self.service_name=service_name
        self._ble = ubluetooth.BLE()
        self._ble.active(True)
        self._ble.irq(handler=self.on_state_change)
        self._connections=set()
        ((self._init_handle,self._status_handle,self._control_handle,),) = self._ble.gatts_register_services((_BREAD_BOX_SERVICE,))
        self._payload = self.advertising_payload(name=self.service_name, services=[_BREAD_BOX_UUID],
                                                 appearance=_ADV_APPEARANCE_BREAD_BOX)
        print('begin advertising')
        self._advertise()
        self.init_bread_box()
        print('init finished')
        self._callbacks=[]

    def register_callback(self,c):
        if(c not in self._callbacks):
            self._callbacks.append(c)

    def init_bread_box(self):
        self._ble.gatts_write(self._init_handle    , bytes(100))
        self._ble.gatts_write(self._status_handle  , bytes(100))
        self._ble.gatts_write(self._control_handle , bytes(100))

    def on_state_change(self,event,data):
        if (event == _IRQ_CENTRAL_CONNECT):
            conn_handler,_,addr, = data
            print('connection from:',addr)
            self._connections.add(conn_handler)
        elif(event==_IRQ_CENTRAL_DISCONNECT):
            conn_handler,_,addr, = data
            print('disconnected from ', addr)
            self._connections.remove(conn_handler)
            self._advertise()
        elif(event==_IRQ_GATTS_WRITE):
            conn_handle, attr_handle = data
            buffer=self._ble.gatts_read(self._control_handle)
            ble_msg=buffer.decode('UTF-8').strip()
            self._on_operate(ble_msg)

    def _advertise(self, interval_us=500000):
        self._ble.gap_advertise(interval_us, adv_data=self._payload)

    def advertising_payload(self, name=None, services=None, appearance=0,limited_disc=False,br_edr=False):
        payload = bytearray()

        def _append(adv_type, value):
            nonlocal payload
            payload += struct.pack('BB', len(value) + 1, adv_type) + value

        _append(_ADV_TYPE_FLAGS, struct.pack('B', (0x01 if limited_disc else 0x02) + (0x00 if br_edr else 0x04)))

        if name:
            _append(_ADV_TYPE_NAME, name)

        if services:
            for uuid in services:
                b = bytes(uuid)
                if len(b) == 2:
                    _append(_ADV_TYPE_UUID16_COMPLETE, b)
                elif len(b) == 4:
                    _append(_ADV_TYPE_UUID32_COMPLETE, b)
                elif len(b) == 16:
                    _append(_ADV_TYPE_UUID128_COMPLETE, b)

        # See org.bluetooth.characteristic.gap.appearance.xml
        _append(_ADV_TYPE_APPEARANCE, struct.pack('<h', appearance))

        return payload

    def run(self,msg):
        buffer=json.dumps(msg)
        self._ble.gatts_write(self._status_handle, buffer)
        for conn_handle in self._connections:
            # Notify connected centrals to issue a read.
            self._ble.gatts_notify(conn_handle, self._status_handle,buffer)

    def _on_operate(self,ops):
        op=ops[0]
        if(op=='switch_light'):
            msg=['temp_up','temp_down']
        elif(op=='startup'):
            msg=['humi_up','humi_down']
        else:
            msg=[op,ops[1]]
        for c in self._callbacks:
            c(msg)
