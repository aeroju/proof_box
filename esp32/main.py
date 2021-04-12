# import wifi_interface

#######################
#   import upip
#   upip.install('picoweb')
#   upip.install('uasyncio')
#   upip.install('pycopy-ulogging')
#   upip.install("micropython-oled")

import utime
import proof_box_controller
import oled_interface
import db_interface
import web_interface
from utils import *

gc.collect()
gc.mem_free()

class ProofBox():
    def __init__(self):
        read_config()
        self.controller = proof_box_controller.ProofBoxController(fake=True)
        # self.tcp_interface = wifi_interface.WifiInterface()
        # self.controller.registe_callback(self.tcp_interface)
        # self.ble_interface = None
        self.oled_interface = oled_interface.OLED_interface()
        self.db_interface = db_interface.DB_Interface()
        self.web_interface = web_interface.Web_Interface()
        MessageCenter.notify(MSG_TYPE_CHANGE_SETTINGS,None)
        # self.controller.registe_callback(self.oled_interface.display_message)
        # self.controller.registe_callback(self.db_interface.display_message)
        # self
        MessageCenter.start()
        self.controller.start()
        utime.sleep(2)
        import proof_box_web
        proof_box_web.start_web()
        pass

