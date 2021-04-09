
import picoweb
import _thread
import utime
import ujson
from utils import *
import db_interface

class _Web_Interface():
    def __init__(self):
        self._lock = _thread.allocate_lock()
        self.__status={}
        MessageCenter.registe_message_callback(MSG_TYPE_CLIENT_STATUS,self.display_message)
        MessageCenter.registe_message_callback(MSG_TYPE_CHANGE_SETTINGS,self.on_setting_change)

    def on_setting_change(self):
        self.min_temp = CONFIG[SETTINGS_MIN_TEMP]
        self.max_temp = CONFIG[SETTINGS_MAX_TEMP]
        self.min_humi = CONFIG[SETTINGS_MIN_HUMI]
        self.max_humi = CONFIG[SETTINGS_MAX_HUMI]

    def display_message(self,msg):
        if(msg['type'] in (MSG_TYPE_INIT,MSG_TYPE_START,MSG_TYPE_STOP,MSG_TYPE_ERROR)):
            pass
        elif(msg['type']==MSG_TYPE_STATUS):
            if(self._lock.acquire()):
                for k,v in msg['value']:
                    self.__status[k]=v
                self._lock.release()

    def get_status(self):
        if(self._lock.acquire()):
            try:
                return self.__status
            finally:
                self._lock.release()
        return None

    def update_settings(self,settings):
        for k,v in settings:
            CONFIG[k]=v
        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,None)


_web_interface=_Web_Interface()
def Web_Interface():
    return _web_interface


app = picoweb.WebApp('Proof Box')

@app.route('/')
def index(req, resp):
    yield from picoweb.start_response(resp)
    yield from picoweb.sendfile(resp,'index.html')

@app.route('/get_status')
def get_status(req, resp):
    status=Web_Interface().get_status()
    status['temp_setting']='({},{})'.format(Web_Interface().min_temp,Web_Interface().max_temp)
    status['humi_setting']='({},{})'.format(Web_Interface().min_humi,Web_Interface().max_humi)
    ret = {'status':status}
    yield from picoweb.start_response(resp)
    yield from resp.awrite(ujson.dumps(ret))
    pass

@app.route('/get_his')
def get_his(req, resp):
    his = db_interface.DB_Interface().read_history()
    ts=[t for t,h,m in his]
    hs=[h for t,h,m in his]
    ms=[m for t,h,m in his]
    ret={'times':ts,'temps':hs,'humis':ms}
    yield from picoweb.start_response(resp)
    yield from resp.awrite(ujson.dumps(ret))
    pass

@app.route('/change_settings')
def change_settings(req, resp):
    if req.method == "POST":
        yield from req.read_form_data()
    else:
        req.parse_qs()
    Web_Interface().update_settings(req.form)
    pass

def run():
    app.run(host='0.0.0.0', port=80, debug=True)



