
import os
import sys,subprocess

path='esp32'
device='/dev/ttyUSB0'
files = os.listdir(path)
for f in files:
    if(os.path.splitext(f)[1] in ['.py','.html'] and f != os.path.split(__file__)[1]):
        print('sending {} to {}'.format(os.path.join(path,f),device))
        args=['ampy','-p',device,'put',os.path.join(path,f)]
        subprocess.run(args)