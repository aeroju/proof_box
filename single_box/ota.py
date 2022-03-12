
import uos
import urequests

SERVER='http://192.168.111.1:8080/ota'
check_version=SERVER  + '/last_version.txt'
files_lists=SERVER + '/files.txt'


version_file='version.txt'

class OTA:
    def __init__(self):
        pass

    def current_version(self):
        if(version_file in uos.listdir()):
            with open(version_file,'r') as f:
                return f.read().strip()
        return 'None'

    def sync_version(self,v):
        with open(version_file,'w') as f:
            f.write(v)

    def get(self,url):
        try:
            resp=urequests.get(url)
            ret= resp.text
            resp.close()
            return ret
        except Exception as e:
            print('error when get url:',url,  ' exception:',e)
            return None

    def check_resp_status(self,c):
        title_begin = c.find('<title>') + len('<title>')
        title_end = c.find('</title>')
        title=c[title_begin:title_end]
        if(title is not None):
            if(title.find('404')>=0 or title.find('503')>=0 ):
                print('check response status fail:',title)
                return False
        return True

    def get_file(self,url,fn):
        try:
            resp=urequests.get(url)
            if(resp is not None and self.check_resp_status(resp.text[:100])):
                try:
                    with open(fn,'w') as f:
                        f.write(resp.content)
                        return True
                finally:
                    resp.close()
        except Exception as e:
            print('error when get file:',fn , ' exception:',e)
        return False

    def check_version(self):
        version=self.get(check_version).strip()
        print('server version:{},local version:{}'.format(version,self.current_version()))
        if(version!=self.current_version()):
            _ok=True
            files=self.get(files_lists).split('\n')
            print('files to fetch:',files)
            for file in files:
                file = file.strip()
                if(file is not None and len(file)>0):
                    print('fetch file:',file)
                    if not self.get_file(SERVER + '/' + file,file):
                        print('False')
                        _ok=False
            if(_ok):
                self.sync_version(version)
                return False
        return True




