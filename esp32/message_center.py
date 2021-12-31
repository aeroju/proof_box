import _thread
import utime
import gc

class Event():
    def __init(self):
        self._lock=_thread.allocate_lock()
        self._is_set=False

    def is_set(self):
        if(self._lock.acquire()):
            try:
                return self._is_set
            finally:
                self._lock.release()

    def set(self):
        if(self._lock.acquire()):
            try:
                self._is_set = True
            finally:
                self._lock.release()

    def clear(self):
        if(self._lock.acquire()):
            try:
                self._is_set = False
            finally:
                self._lock.release()


class Queue():
    def __init__(self):
        self.messages=[]
        self._lock = _thread.allocate_lock()

    def put(self,msg):
        if(self._lock.acquire(0)):
            try:
                self.messages.append(msg)
            except Exception as e:
                print('error when put message:',e)
            finally:
                self._lock.release()
        pass

    def get(self):
        if(self._lock.acquire(0)):
            try:
                if(len(self.messages)>0):
                    return self.messages.pop(0)
            finally:
                self._lock.release()
        return None

class __MessageCenter():
    def __init__(self):
        self.__message_callbacks = {}
        self.__messages = Queue()
        self.__process_thread = None

    def start(self):
        self.__process_thread=_thread.start_new_thread(self.__comsume_message,())

    def registe_message_callback(self,message_type, callback):
        calls = self.__message_callbacks.get(message_type, [])
        calls.append(callback)
        self.__message_callbacks[message_type] = calls

    def remove_message_callback(self,message_type,callback):
        calls = self.__message_callbacks.get(message_type,[])
        if(calls.index(callback)>=0):
            calls.pop(calls.index(callback))
        self.__message_callbacks[message_type] = calls

    def notify(self,message_type, message_body):
        message = {'message_type': message_type, 'message_body': message_body}
        self.__messages.put(message)

    def __notify_message(self,calls, message):
        for c in calls:
            try:
                if(message is not None):
                    c(message)
                else:
                    c()
            except Exception as e:
                print('error when call callback:',e,message,c)
                pass

    def __comsume_message(self):
        gc_count=0
        while (True):
            try:
                msg = self.__messages.get()
                if(msg is not None):
                    calls = self.__message_callbacks.get(msg['message_type'], [])
                    _thread.start_new_thread(self.__notify_message, (calls, msg['message_body']))
                    # self.__notify_message(calls,msg['message_body'])
            except Exception as e:
                pass
            finally:
                utime.sleep(2)
            if(gc_count>20):
                gc.collect()
                lt=utime.localtime()
                print('{}:{}:{}'.format(lt[3],lt[4],lt[5]),' mem free:',gc.mem_free())
                gc_count=0
            gc_count+=1

MessageCenter = __MessageCenter()
# MessageCenter.start()