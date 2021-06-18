import urllib3
import threading
import time
import json
import numpy as np
import cv2
import img_to_video
from message_center import *
proof_box_address=('192.168.31.233',80)
proof_box_camera_address=('192.168.31.105',80)

class ProofStatus():
    status=-1
    start_time=-1
    during=-1
    temp=-1
    humi=-1

class ProofBoxWebClient():
    def __init__(self):
        self.__stop_sign = threading.Event()
        self._status = ProofStatus()
        self._status_lock = threading.Lock()
        self._img_to_video=None
        # MessageCenter.registe_message_callback(MSG_TYPE_STATUS,self.on_status_change)
        # self.monitor_proof_box_camera()
        # threading.Thread(target=self.monitor_proof_box_camera,args=()).start()
        pass

    def on_status_change(self,status):
        if(self._status_lock.acquire()):
            self._status.status=status
            self._status.start_time=time.time()
            self._status.during=0
            self._img_to_video=img_to_video.ImageToVideo('proof_box_{}_{}.mp4'.format(self._status.start_time,self._status.status),fps=10)
            self._status_lock.release()

    def monitor_proof_box_controller(self):
        http = urllib3.PoolManager()
        while(not self.__stop_sign.is_set()):
            try:
                r = http.request(method='get',url='http://{}:{}/get_status'.format(proof_box_address[0],proof_box_address[1]))
                status=json.loads(r.data.decode('utf-8'))['status']
                if(status['status']==self._status.status):
                    if(self._status_lock.acquire()):
                        self._status.during=time.time()-self._status.start_time
                        self._status.humi=status['humi']
                        self._status.temp=status['temp']
                        self._status_lock.release()
                else:
                    MessageCenter.notify(MSG_TYPE_STATUS,status['status'])
            except Exception as e:
                pass
            finally:
                pass

            time.sleep(10)

    def get_img(self):
        http=urllib3.PoolManager()
        r = http.request(method='get',url='http://{}:{}/'.format(proof_box_camera_address[0],proof_box_camera_address[1]))
        image = np.asarray(bytearray(r.data), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        cv2.imwrite('test.jpeg',image)

    def monitor_proof_box_camera(self):
        http=urllib3.PoolManager()
        cnt=0
        http.request('get','http://{}:{}/control?var=framesize&val=10'.format(proof_box_camera_address[0],proof_box_camera_address[1]))
        size=None
        while(cnt<60):
            print('begin get image',cnt)
            r = http.request(method='get',url='http://{}:{}/capture'.format(proof_box_camera_address[0],proof_box_camera_address[1]))
            print('get image done',cnt)
            image = np.asarray(bytearray(r.data), dtype="uint8")
            image = cv2.imdecode(image, cv2.IMREAD_COLOR)
            # size = image.shape
            # cv2.imwrite('proof_box_{}.jpeg'.format(cnt),image)
            if(self._img_to_video is None):
                self._img_to_video=img_to_video.ImageToVideo('proof_box_1.mp4',fps=5,with_open=True,video_size=(1024,768))
            self._img_to_video.append_img_with_open(image)
            time.sleep(10)
            cnt+=1
        print('capture finished')
        self._img_to_video.close()
        print('Done')
        # height, width, channels = size
        # fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        # # fourcc=cv2.VideoWriter_fourcc('M','J','P','G')
        # out = cv2.VideoWriter('proof_box_1.mp4', fourcc, 10, (width, height))
        # for i in range(20):
        #     img =cv2.imread('proof_box_{}.jpeg'.format(i))
        #     # if(ret):
        #     out.write(img)
        # out.release()


if __name__=='__main__':
    ProofBoxWebClient().monitor_proof_box_camera()


