import _thread

import utime
import uos
import picoweb
import uasyncio

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

class WebOutput():
    def __init__(self,name):
        routes=[('/',self._index)
                ,('/his',self._get_his)
                ,('/status',self._get_status)
                ,('/operate',self._on_operate)
                ]
        self.app=picoweb.WebApp(name,routes)
        self.status={}
        self.mode='COOLER'
        self._callbacks=[]
        self.cache_file_name='his.txt'
        self.file_lock=uasyncio.Lock()
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
            tt=self.status.get('t')
            line.append('{}-{}-{} {}:{}:{}'.format(tt[0],tt[1],tt[2],tt[3],tt[4],tt[5]))
        else:
            line.append(str(''))
        line.append(self._num_to_str(msg.get('tin')))
        line.append(self._num_to_str(msg.get('tout')))
        with open(self.cache_file_name,'a+') as fh:
            fh.write('^'.join(line)+'\r\n' )
        line.clear()

    def _index(self,req, resp):
        yield from self.sendfile(resp,'index.html')
        pass

    def _get_his(self,req,resp):
        if(self.cache_file_name in uos.listdir()):
            yield from self.sendfile(resp,self.cache_file_name)
        else:
            yield from picoweb.start_response(resp)
            yield from resp.awrite("")

    def _get_status(self,req,resp):
        if(self.status is None or len(self.status)==0):
            yield from picoweb.jsonify(resp,{})
        else:
            yield from picoweb.jsonify(resp,self.status)

    def start(self,loop):
        self.app.run(host='0.0.0.0', port=80, debug=-1,loop=loop)

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


