import cv2
import numpy as np
import imutils
import urllib3
import time
proof_box_camera_address=('192.168.31.105',80)

class GetContentSize():
    def __init__(self):
        pass

    def remove_bg(self,bg_img,curr_img):
        cv2.imshow('bg',bg_img)
        bg_gray = cv2.cvtColor(bg_img, cv2.COLOR_BGR2GRAY)
        curr_gray = cv2.cvtColor(curr_img,cv2.COLOR_BGR2GRAY)
        sub = bg_gray.astype("int32") - curr_gray.astype("int32")
        sub = np.absolute(sub).astype("uint8")
        cv2.imshow('sub',sub)
        thresh = cv2.threshold(sub, 0, 255,
                               cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
        thresh = cv2.erode(thresh, None, iterations=1)
        thresh = cv2.dilate(thresh, None, iterations=1)
        cv2.imshow("thresh2",thresh)
        cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
                                cv2.CHAIN_APPROX_SIMPLE)
        cnts = imutils.grab_contours(cnts)
        (minX, minY) = (np.inf, np.inf)
        (maxX, maxY) = (-np.inf, -np.inf)

        for c in cnts:
            (x, y, w, h) = cv2.boundingRect(c)
            if w > 20 and h > 20:
                # update our bookkeeping variables
                minX = min(minX, x)
                minY = min(minY, y)
                maxX = max(maxX, x + w - 1)
                maxY = max(maxY, y + h - 1)
        current_size=(maxX-minX,maxY-minY)
        cv2.rectangle(curr_img, (minX, minY), (maxX, maxY), (0, 255, 0), 2)
        cv2.imshow('result',curr_img)
        cv2.waitKey(0)
        return current_size

    def get_from_ys(self):
        ip_address='192.168.31.234'
        password='FDHPKP'
        url='rtsp://admin:{}@{}:554/h264/ch1/main/av_stream'.format(password,ip_address)

        vs=cv2.VideoCapture(url)
        ret,img = vs.read()
        cnt=0
        while(not ret and cnt<20):
            time.sleep(1)
            ret,img = vs.read()
            cnt+=1
        vs.release()
        if(ret):
            return img


    def test_bg_remove(self):
        bg = self.get_from_ys()
        print('bg read, wait 10 secs')
        time.sleep(10)
        fg= self.get_from_ys()
        print(self.remove_bg(bg,fg))

    def get_from_dh(self):
        ip_address='192.168.31.218'
        password='onetwo123'
        url='rtsp://admin:{}@{}:554/cam/realmonitor?channel=1&subtype=0'.format(password,ip_address)

    def get_img(self):
        http=urllib3.PoolManager()
        cnt=0
        http.request('get','http://{}:{}/control?var=framesize&val=10'.format(proof_box_camera_address[0],proof_box_camera_address[1]))
        print('getting background...')
        r = http.request(method='get',url='http://{}:{}/capture?'.format(proof_box_camera_address[0],proof_box_camera_address[1]))
        print('get image done',cnt)
        bg_image = np.asarray(bytearray(r.data), dtype="uint8")
        bg_image = cv2.imdecode(bg_image, cv2.IMREAD_COLOR)
        time.sleep(5)
        print('getting foregrand...')
        r = http.request(method='get',url='http://{}:{}/capture?'.format(proof_box_camera_address[0],proof_box_camera_address[1]))
        print('get image done',cnt)
        fg_image = np.asarray(bytearray(r.data), dtype="uint8")
        fg_image = cv2.imdecode(fg_image, cv2.IMREAD_COLOR)
        print(self.remove_bg(bg_image,fg_image))

if __name__ == '__main__':
    GetContentSize().test_bg_remove()

