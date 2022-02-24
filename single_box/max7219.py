"""
MicroPython max7219 cascadable 8x8 LED matrix driver
https://github.com/mcauser/micropython-max7219

MIT License
Copyright (c) 2017 Mike Causer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

from micropython import const
import framebuf
import utime
from machine import Timer,Pin,SPI

_NOOP = const(0)
_DIGIT0 = const(1)
_DECODEMODE = const(9)
_INTENSITY = const(10)
_SCANLIMIT = const(11)
_SHUTDOWN = const(12)
_DISPLAYTEST = const(15)

CHARS={  '0':0b01111110
        ,'1':0b00110000
        ,'2':0b01101101
        ,'3':0b01111001
        ,'4':0b00110011
        ,'5':0b01011011
        ,'6':0b01011111
        ,'7':0b01110000
        ,'8':0b01111111
        ,'9':0b01111011
        ,'-':0b00000001
        ,'E':0b01001111
        ,'H':0b00110111
        ,'L':0b00001110
        ,'P':0b01100111
        ,' ':0b0
        ,'C':0b01001110
        ,'O':0b01111110
        ,'R':0b00100111
        ,'T':0b00001111
        ,'A':0b01110111
        ,'S':0b01011011
        ,'N':0b01110110
        ,'U':0b00111110
        ,'B':0b00011111
        ,'M':0b00010101
        ,'F':0b01000111
       }


class Matrix8x8:
    def __init__(self, sck,mosi, cs, num, flash_timer):

        self.spi = SPI(1,baudrate=10000000, polarity=1, phase=0,
                       sck=Pin(sck),
                       mosi=Pin(mosi))
        self.cs = Pin(cs)
        self.cs.init(self.cs.OUT, True)
        self.num = num
        self.init()
        self.flash_timer=flash_timer
        self.content=[' ']*self.num
        self.on_flash=False
        self.internal_cnt=utime.time()

    def _write(self,command,data):
        self.cs(0)
        self.spi.write(bytearray([command,data]))
        self.cs(1)

    def init(self):
        for command,data in (
                (0x09,0x00), #decode mode BCD
                (0x0a, 0x03), # brightness=3
                (0x0b,0x07), #scan limit=7
                (0x0c, 0x01),# drop mode=1
                (0x0f,0x01) # show test
        ):
            self._write(command,data)
        utime.sleep_ms(100)
        self._write(0x0f,0x00)
        self.content=[' ']*self.num

    def brightness(self,val):
        val=0x0 if val<=0 else val if val<=0xf else 0xf
        self._write(0x0a, val)

    def shutdown(self):
        self.brightness(0)
        self._write(0x0c, 0x0)
        self._write(0x0f,0x00)

    def write_txt(self,txt):
        if(utime.time()-self.internal_cnt>60):
            self.init()
            self.internal_cnt=utime.time()
        if(not self.on_flash):
            self.flash_timer.deinit()
            self._write_txt(txt)

    def _write_txt(self,txt):
        # for i in range(self.num):
        #     self._write(i+1,0xf)
        pos=self.num
        for i in range(len(txt)):
            s = txt[i]
            if(pos<=0):
                break
            k=CHARS.get(s)
            if(k is None):
                continue
            if(i+1<len(txt)-1):
                if(txt[i+1]=='.'):
                    k=0x80|k
            if(self.content[pos-1]!=k):
                self._write(pos,k)
                self.content[pos-1]=k
            pos-=1

    def _flash(self,t):
        if(self._is_flash):
            self._write_txt(self.content_to_show)
        else:
            self._write_txt('        ')
        self._is_flash = not self._is_flash
        if(utime.time()-self.flash_start_time>5):
            t.deinit()
            self.on_flash=False
            self._write_txt(self.content_to_show)

    def write_flash_txt(self,txt,interval=400):
        self.flash_timer.deinit()
        self._is_flash=False
        self.on_flash=True
        self.flash_start_time=utime.time()
        self.content_to_show=txt
        self.flash_timer.init(mode=Timer.PERIODIC, period=interval, callback=self._flash)

    def write_rowing_txt(self,txt,interval=400):
        self.flash_timer.deinit()
        if(txt is not None and len(txt)>0):
            bb=''.join([' ' for _ in range(self.num+1)])
            txt=''.join([bb,txt,bb])
            for i in range(self.num + 1):
                t=txt[i:self.num+i]
                self._write_txt(t)
                utime.sleep_ms(interval)

