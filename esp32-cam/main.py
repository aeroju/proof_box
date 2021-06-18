
# import upip
# upip.install('micropython-http.client')

#启动摄像头，每分钟拍摄一次，画面传输到rasipi
#rasipi接到摄像头的通知后查询proof_box的状态，在图片上打水印，生成延时动画
import camera
import uasyncio as asyncio
from http.client import HTTPConnection
import utime


def get_img():
    camera.init(0)
    await asyncio.sleep(2)
    buf = camera.capture()
    t=0
    while((not len(buf)>0) and t<3):
        await asyncio.sleep(2)
        buf=camera.capture()
        t+=1
    camera.deinit()
    if(len(buf)>0):
        return buf
    else:
        return None

def run():
    while(True):


