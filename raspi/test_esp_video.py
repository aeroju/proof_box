from img_to_video import *

import os
import cv2

imgs_path='/Volumes/U2G'
files_cnt = len(os.listdir(imgs_path))
img_to_video=ImageToVideo('esp_5.mp4',fps=60,with_open=True,video_size=(1024,768))

dt={}
with open(os.path.join(imgs_path,'dt.txt'),'r') as fh:
    for l in fh.readlines():
        cnt,t=l.split(',')
        dt[cnt]=t.strip()

b=4
for i in range(b,b+files_cnt):
    fn='cap_{}.jpg'.format(i)
    fn = os.path.join(imgs_path,fn)
    if(os.path.exists(fn) and os.path.getsize(fn)>10):
        print('processing:',fn)
        try:
            img = cv2.imread(fn)
            # img = cv2.rotate(img,cv2.cv2.ROTATE_180)
            if(str(i) in dt.keys()):
                s=dt[str(i)]
            else:
                s=''
            img = cv2.putText(img,s,(350,1100),cv2.FONT_HERSHEY_SIMPLEX,1,(0, 255, 0),2)
            img = cv2.resize(img,(1024,768))
            img_to_video.append_img_with_open(img)
        except cv2.error:
            pass

img_to_video.close()
print('done')