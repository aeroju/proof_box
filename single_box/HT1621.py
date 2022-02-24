import pyb

CMD_SYS_DIS     = const(0x00)
CMD_SYS_EN      = const(0x01)
CMD_LCD_OFF     = const(0x02)
CMD_LCD_ON      = const(0x03)
CMD_TIMER_DIS   = const(0x04)
CMD_WDT_DIS     = const(0x05)
CMD_TIMER_EN    = const(0x06)
CMD_WDT_EN      = const(0x07)
CMD_TONE_OFF    = const(0x08)
CMD_TONE_ON     = const(0x09)
CMD_CLR_TIMER   = const(0x0D)
CMD_CLR_WDT     = const(0x0E)
CMD_XTAL_32K    = const(0x14)
CMD_RC_256K     = const(0x18)
CMD_EXT_256K    = const(0x1D)
CMD_BIAS_1_2_P  = const(0x20)
CMD_BIAS_1_3_P  = const(0x21)
CMD_TONE_4K     = const(0x40)
CMD_TONE_2K     = const(0x60)
CMD_IRQ_DIS     = const(0x80)
CMD_IRQ_EN      = const(0x88)
CMD_WDT_CO_P    = const(0xA0)   
CMD_TEST        = const(0xE0)
CMD_NORMAL      = const(0xE3)   

BIAS_2COM       = const(0x00)
BIAS_3COM       = const(0x04)
BIAS_4COM       = const(0x08)

MODE_READ       = const(0x0D)
MODE_WRITE      = const(0x0A)
MODE_READ_WRITE = const(0x0B)
MODE_CMD        = const(0x08)

class HT1621(object):
    def __init__(self, cs, wr, dat):
        self.cs_pin = cs
        self.wr_pin = wr
        self.data_pin = dat

        cs.init(cs.OUT_PP)
        wr.init(wr.OUT_PP)
        dat.init(dat.OUT_PP)

        cs.high()
        wr.high()
        dat.high()

    def writeOneBit(self, bitData):
        self.wr_pin.low()
        self.data_pin.value(bitData)
        self.wr_pin.high()

    def setMode(self, mode):
        if (mode == MODE_READ):
            modeBit1 = 1
            modeBit2 = 0
        elif (mode == MODE_WRITE):
            modeBit1 = 0
            modeBit2 = 1
        elif (mode == MODE_READ_WRITE):
            modeBit1 = 0
            modeBit2 = 1
        elif (mode == MODE_CMD):
            modeBit1 = 0
            modeBit2 = 0
        else:
            modeBit1 = 1
            modeBit2 = 1

        if (modeBit1 == 1) and (modeBit2 ==1):
            self.cs_pin.high()
        else:
            self.cs_pin.low()

            self.writeOneBit(1)
            self.writeOneBit(modeBit1)
            self.writeOneBit(modeBit2)

    def writeCmd(self, cmd):
        self.setMode(MODE_CMD)

        for i in range(8):  #代表从0到8(不包含8)
            tmp = 0x80>>i
            if((cmd&tmp) != 0):
                self.writeOneBit(1)
            else:
                self.writeOneBit(0)
        self.writeOneBit(0) #Bit9 data don't care	
        self.cs_pin.high()

    def reset(self, bias):
        if (bias == 3):
            self.writeCmd(CMD_BIAS_1_3_P | BIAS_4COM)
        else:
            self.writeCmd(CMD_BIAS_1_2_P | BIAS_4COM)
        self.writeCmd(CMD_LCD_ON)
        self.writeCmd(CMD_SYS_EN)

    def writeByte(self, address, byteData):
        self.setMode(MODE_WRITE)

        for i in range(6):
            tmp = 0x20>>i
            if((address&tmp) != 0):
                self.writeOneBit(1)
            else:
                self.writeOneBit(0)
    
        for i in range(4):
            tmp = 0x01<<i
            if((byteData&tmp) != 0):
                self.writeOneBit(1)
            else:
                self.writeOneBit(0)

        self.cs_pin.high()

    def writeBytes(self, address, bytes, count):
        self.setMode(MODE_WRITE)
            
        for i in range(6):
            tmp = 0x20>>i
            if((address&tmp) != 0):
                self.writeOneBit(1)
            else:
                self.writeOneBit(0)
    
        for i in range(count):
            for j in range(4):

                tmp = 0x01<<j;
                if((bytes[i]&tmp) != 0):
                    self.writeOneBit(1)
                else:
                    self.writeOneBit(0)
    
        self.cs_pin.high()

    def clrRam(self):
        for i in range(32): 
            self.writeByte(i,0)

    def setRam(self):
        for i in range(32): 
            self.writeByte(i,0xf)
