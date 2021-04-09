# import wifi_interface
import ujson
import proof_box_controller
import oled_interface
import db_interface
import web_interface
from utils import *

class ProofBox():
    def __init__(self):
        read_config()
        self.controller = proof_box_controller.ProofBoxController(fake=True)
        # self.tcp_interface = wifi_interface.WifiInterface()
        # self.controller.registe_callback(self.tcp_interface)
        self.ble_interface = None
        self.oled_interface = oled_interface.OLED_interface()
        self.db_interface = db_interface.DB_Interface()
        # self.controller.registe_callback(self.oled_interface.display_message)
        # self.controller.registe_callback(self.db_interface.display_message)
        # self
        self.controller.start()
        web_interface.run()
        pass

    def on_interface_callback(self):
        pass

    # def change_settings(self,settings):
    #     for k,v in settings:
    #         CONFIG[k] = v
    #     self.controller.on_setting_change()
    #     self.oled_interface.on_setting_change()
    #     pass

    def buf_to_cmd(self,buf):
        return buf.decode('utf8')

    # def notify_status(self,status_map):
    #     cmd={'cmd':'notify','val':status_map}
    #     if(self.tcp_connection is not None):
    #         self.tcp_connection.send_to(ujson.dumps(cmd).encode('utf8'))
    #
    # def send_img(self,img):
    #     cmd = {'cmd':'img','val':img}
    #     if(self.tcp_connection is not None):
    #         self.tcp_connection.send_to(ujson.dumps(cmd).encode('utf8'))

    def remote_operate(self,buf):
        cmd = ujson.loads(buf.decode('utf8'))
        if(cmd['cmd']=='set_temp'):
            pass
