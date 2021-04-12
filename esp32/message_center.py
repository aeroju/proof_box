import _thread
import utime
import gc

class Queue():
    def __init__(self):
        self.messages=[]
        self._lock = _thread.allocate_lock()

    def put(self,msg):
        if(self._lock.acquire()):
            try:
                self.messages.append(msg)
            finally:
                self._lock.release()
        pass

    def get(self):
        if(self._lock.acquire()):
            try:
                # print('message queue len:',len(self.messages))
                if(len(self.messages)>0):
                    return self.messages.pop(0)
                return None
            finally:
                self._lock.release()

class __MessageCenter():
    def __init__(self):
        self.__message_callbacks = {}
        self.__messages = Queue()
        self.__messages_callbacks_lock = _thread.allocate_lock()
        self.__process_thread = None

    def start(self):
        self.__process_thread=_thread.start_new_thread(self.__comsume_message,())

    def registe_message_callback(self,message_type, callback):
        if(self.__messages_callbacks_lock.acquire()):
            calls = self.__message_callbacks.get(message_type, [])
            calls.append(callback)
            self.__message_callbacks[message_type] = calls
            self.__messages_callbacks_lock.release()

    def remove_message_callback(self,message_type,callback):
        if(self.__messages_callbacks_lock.acquire()):
            calls = self.__message_callbacks.get(message_type,[])
            if(calls.index(callback)>=0):
                calls.pop(calls.index(callback))
            self.__message_callbacks[message_type] = calls
            self.__messages_callbacks_lock.release()

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
                    calls=[]
                    if(self.__messages_callbacks_lock.acquire()):
                        calls = self.__message_callbacks.get(msg['message_type'], [])
                        self.__messages_callbacks_lock.release()
                    _thread.start_new_thread(self.__notify_message, (calls, msg['message_body']))
                    # self.__notify_message(calls,msg['message_body'])
            except Exception as e:
                pass
                # print('error when process message:',e,msg)
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