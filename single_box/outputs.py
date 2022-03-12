import _thread

import utime
import uos
import picoweb
import uasyncio
from proof_config import SetupConfig,ProofConfig

def time_to_str(ct):
    ct=utime.localtime(ct)
    return '{:02d}:{:02d}:{:02d}'.format(ct[3],ct[4],ct[5])

def time_to_str2(ct):
    ct=utime.localtime(ct)
    return '{:02d}H{:02d}.{:02d}'.format(ct[3],ct[4],ct[5])

def nums_to_str(t1,t2):
    s1 = '{: 05.1f}'.format(t1) if t1 is not None else 'NULL'
    s2 = '{: 05.1f}'.format(t2) if t2 is not None else 'NULL'
    return  s1 + s2

class MMData():
    def __init__(self,start_time):
        self.min_data=100
        self.max_data=-100
        self.start_time=start_time
        self.min_d=self.max_d=utime.time()
    def feed(self,m,d):
        if(m is None):
            return
        if(d-self.start_time<1800):
            return
        if(m>self.max_data):
            self.max_data=m
            self.max_d=d
        if(m<self.min_data):
            self.min_data=m
            self.min_d=d
    def __str__(self):
        return 'Max:{} at {}, Min:{} at {}'.format(self.max_data,time_to_str(self.max_d),self.min_data,time_to_str(self.min_d))

class PeakOutput():
    def __init__(self,start_time):
        self.mm_t1=MMData(start_time)
        self.mm_h1=MMData(start_time)
        self.mm_t2=MMData(start_time)
        self.mm_h2=MMData(start_time)

    def find_peak(self,msg):
        t=utime.time()
        self.mm_t1.feed(msg.get('t1'),t)
        self.mm_h1.feed(msg.get('h1'),t)
        self.mm_t2.feed(msg.get('t2'),t)
        self.mm_h2.feed(msg.get('h2'),t)

    def run(self,msg,func):
        self.find_peak(msg)
        if(func is not None):
            ss=' '.join(['T1', str(self.mm_t1), 'H1',str(self.mm_h1),'T2',str(self.mm_t2),'H2',str(self.mm_h2)])
            # func(ss)


class WebOutput():
    def __init__(self,box_config:ProofConfig):
        routes=[('/',self._index)
                ,('/his',self._get_his)
                ,('/box_config',self._get_box_config)
                ,('/status',self._get_status)
                ,('/operate',self._on_operate)
                ,('/change_settings',self._on_change_settings)
                ,('/get_settings',self._on_get_settings)
            ]
        self.app=picoweb.WebApp('Frig Web Server',routes)
        self.status={}
        self._callbacks=[]
        self.cache_file_name='his.txt'
        self.file_lock=uasyncio.Lock()
        self.box_config=box_config
        if(self.cache_file_name in uos.listdir()):
            st=uos.stat(self.cache_file_name)
            #if last modify time before 1 hour ago, then discard
            if(utime.time()-st[8]>3600):
                uos.remove(self.cache_file_name)
        pass

    def register_callback(self,c):
        if(c not in self._callbacks):
            self._callbacks.append(c)

    def _num_to_str(self,n):
        if(n is None):
            return ''
        return '{: 05.1f}'.format(n)

    def run(self,msg):
        self.status=msg
        line=[]
        # line.append(str(msg.get('bt')))
        if(self.status.get('t') is not None):
            tt=utime.localtime(self.status.get('t'))
            line.append('{}-{}-{} {}:{}:{}'.format(tt[0],tt[1],tt[2],tt[3],tt[4],tt[5]))
        else:
            line.append(str(''))
        if(msg.get('measure') is not None):
            for m in msg['measure']:
                line.append(m[0])
                line.append(str(m[1]))
                line.append(str(m[2]))
            with open(self.cache_file_name,'a+') as fh:
                fh.write('^'.join(line)+'\r\n' )
        line.clear()

    def set_config(self,config:SetupConfig):
        self.config=config

    def _index(self,req, resp):
        yield from self.sendfile(resp,'index.html')
        pass

    def _get_box_config(self,req,resp):
        msg={'functions':self.box_config.functions,'sersors':[],'heaters':[],'fans':[],'frigs':[],'humis':[]}
        for s in self.box_config.sensors:
            msg['sersors'].append(s[0])
        for c in self.box_config.heaters:
            msg['heaters'].append(c[0])
        for c in self.box_config.fans:
            msg['fans'].append(c[0])
        for c in self.box_config.frigs:
            msg['frigs'].append(c[0])
        for c in self.box_config.humis:
            msg['humis'].append(c[0])
        yield from picoweb.jsonify(resp,msg)


    def _get_his(self,req,resp):
        if(self.cache_file_name in uos.listdir()):
            yield from self.sendfile(resp,self.cache_file_name)
        else:
            yield from picoweb.start_response(resp)
            yield from resp.awrite("")

    def _get_status(self,req,resp):
        if(self.status is None or len(self.status)==0 or self.status.get('r')==False):
            yield from picoweb.jsonify(resp,{'mode':self.config.mode,'r':False,'tt':self.config.target_temp,'th':self.config.target_humi})
        else:
            if(self.status.get('t') is not None):
                tt=utime.localtime(self.status.get('t'))
                self.status['dts']='{}-{}-{} {}:{}:{}'.format(tt[0],tt[1],tt[2],tt[3],tt[4],tt[5])
            yield from picoweb.jsonify(resp,self.status)

    def _on_operate(self,req,resp):
        req.parse_qs()
        op=req.form['op']
        if(op=='switch_light'):
            msg=['temp_up','temp_down']
        elif(op=='startup'):
            msg=['humi_up','humi_down']
        elif(op=='shutdown'):
            msg=['temp_up','humi_down']
        else:
            msg=[op,req.form['value']]
        for c in self._callbacks:
            c(msg)
        yield from picoweb.start_response(resp)
        yield from resp.awrite("OK")

    def _on_change_settings(self,req,resp):
        if(req.method=='POST'):
            yield from req.read_form_data()
        else:
            req.parse_qs()
        for k in req.form.keys():
            self.config.tolerance[k]=req.form[k]
        print('data get from client:',self.config.tolerance)
        msg=['change_config',self.config]
        for c in self._callbacks:
            c(msg)
        yield from picoweb.start_response(resp)
        yield from resp.awrite("OK")

    def _on_get_settings(self,req,resp):
        print('_on_get_config',self.config.tolerance)
        yield from picoweb.jsonify(resp,self.config.tolerance)

    def start(self,loop):
        self.app.run(host='0.0.0.0', port=80, debug=-1,loop=loop)
        # def _run():
        #     self.app.run(host='0.0.0.0', port=80, debug=-1)
        # _thread.start_new_thread(_run,())

    def sendfile(self,writer, fname, content_type=None, headers=None):
        if not content_type:
            content_type = picoweb.get_mime_type(fname)
        try:
            if(fname not in uos.listdir()):
                yield from picoweb.http_error(writer, "404")
            else:
                with open(fname) as f:
                    yield from picoweb.start_response(writer, content_type, "200", headers)
                    yield from picoweb.sendstream(writer, f)
        except OSError as e:
            if e.args[0] == picoweb.uerrno.ENOENT:
                yield from picoweb.http_error(writer, "404")
            else:
                raise


