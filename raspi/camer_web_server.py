import tornado.web
import tornado.ioloop
import tornado.httpserver

from multiprocessing import Manager
import ctypes,os,json,random

from pyecharts.charts import Gauge, Liquid
from pyecharts import options as opts

def set_default_header(self):
    # 后面的*可以换成ip地址，意为允许访问的地址
    self.set_header("Access-Control-Allow-Origin", "*")
    self.set_header("Access-Control-Allow-Headers", "x-requested-with")
    self.set_header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE")
    self.set_header("Content-Type", "application/json; charset=UTF-8")

class PageHandler(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self):
        print('return index.html')
        self.render("index.html")

bio_value_ = Manager()


class CaptureESP32Cam(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get_heart_rate(self):
        min_hr = 60
        burn_min_hr = 90
        burn_max_hr = 160
        max_hr = 180
        c = (Gauge()
             .add('当前心率'
                  , [('current', heart_rate.get())]
                  ,min_= min_hr
                  ,max_ = max_hr
                  , axisline_opts=opts.AxisLineOpts(
                linestyle_opts= opts.LineStyleOpts(color=[((burn_min_hr-min_hr)/(max_hr-min_hr),'green'),((burn_max_hr-min_hr)/(max_hr-min_hr),'brown'),(1,'red')], width=30)
            )
                  ,detail_label_opts=opts.LabelOpts(formatter="{value}")
                  )
             )
        return c.dump_options()

    def get(self):
        set_default_header(self)

        chart_result = self.get_heart_rate()
        # 返回结果
        self.write(chart_result)
        self.finish()

    def post(self):
        set_default_header(self)

        chart_result = self.get_heart_rate()
        # 返回结果
        self.write(chart_result)
        self.finish()

class CaptureStatus(tornado.web.RequestHandler):
    def get(self):
        cmd=self.get_argument('action')
        if(cmd=='status_change'):# 状态包括发酵类型变化，进入关机状态
            pass
        elif(cmd=='status_notify'): #来自发酵箱的温湿度及
            pass
        elif(cmd=='settings_change')

class GetVideo(tornado.web.RequestHandler):
    def data_received(self, chunk):
        pass

    def get(self):
        set_default_header(self)
        print(self.get_argument('action'))
        if(self.get_argument('action')=='start'):
            s.run(no_show=True, show_raw=False)
        else:
            s.stop()
        # 返回结果
        self.write('')
        self.finish()


def make_app():
    exec_path = os.getcwd()
    return tornado.web.Application([
        (r"/", PageHandler),
        (r"/js/(.*)", tornado.web.StaticFileHandler,{'path':os.path.join(exec_path,'js')}),
        (r"/capture", CaptureESP32Cam),
        (r'/get_video',GetVideo),
    ])


def run():
    port = 8889
    app = make_app()

    sockets = tornado.netutil.bind_sockets(port)
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.add_sockets(sockets)
    print("Server Start Running!\nHost: {} Port: {}".format("127.0.0.1", port))
    tornado.ioloop.IOLoop.instance().start()