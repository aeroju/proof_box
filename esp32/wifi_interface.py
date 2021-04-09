import uos,gc,utime
import struct
import usocket
import _thread

from utils import *

class WifiInterface():
    def __init__(self):
        self.callbacks = []
        self.sock = self.connect_to()
        self.reading_thread = _thread.start_new_thread(self.reading,())
        pass

    def registe_callback(self,c):
        if(c is not None): self.callbacks.append(c)

    def remove_callback(self,c):
        if(c is not None): self.callbacks.remove(c)

    def connect_to(self):
        t = 0
        while(True):
            try:
                sock =  usocket.socket(usocket.AF_INET,usocket.SOCK_STREAM)
                sock.connect((CONFIG['tcp_server'], 6901))
                sock.settimeout(5)
                return sock
            except OSError as e:
                utime.sleep(10)
                gc.collect()
                t+=1
                if(t>=20):
                    machine.reset()
                continue

    def send_to(self,buf):
        try:
            if(self.sock is None):
                self.sock= self.connect_to()
            if (self.sock is not None ):
                len=self.sock.send(buf)
                return
        except OSError as e:
            self.sock = None
        except Exception as e:
            self.sock = None

    def reading(self):
        buf=b''
        while(True):
            if(self.sock is not None and self.sock.connected):
                try:
                    tmp = self.sock.recv(1024)
                    buf = buf+tmp
                    try:
                        msg = ujson.loads(buf.decode('utf8'))
                        self.notify_settings(msg)
                        buf=b''
                    except Exception:
                        pass

                except OSError:
                    self.sock = None
                    pass
            utime.sleep(1)

    def display_message(self,msg):
        cmd={'type':MSG_TYPE_CLIENT_STATUS,'value':msg}
        buf = ujson.dumps(cmd).encode('utf8')
        self.send_to(buf)

    def notify_settings(self,msg):
        if(msg['type']==MSG_TYPE_CHANGE_SETTINGS):
            for c in self.callbacks:
                c(msg['value'])

