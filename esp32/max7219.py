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
from machine import Timer

_NOOP = const(0)
_DIGIT0 = const(1)
_DECODEMODE = const(9)
_INTENSITY = const(10)
_SCANLIMIT = const(11)
_SHUTDOWN = const(12)
_DISPLAYTEST = const(15)

CHARS={'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'-':10,'E':11,'H':12,'L':13,'P':14,' ':15}

class Matrix8x8:
    def __init__(self, spi, cs, num):

        self.spi = spi
        self.cs = cs
        self.cs.init(cs.OUT, True)
        self.buffer = bytearray(8 * num)
        self.num = num
        fb = framebuf.FrameBuffer(self.buffer, 8 * num, 8, framebuf.MONO_HLSB)
        self.framebuf = fb
        self.fill = fb.fill  # (col)
        self.pixel = fb.pixel # (x, y[, c])
        self.hline = fb.hline  # (x, y, w, col)
        self.vline = fb.vline  # (x, y, h, col)
        self.line = fb.line  # (x1, y1, x2, y2, col)
        self.rect = fb.rect  # (x, y, w, h, col)
        self.fill_rect = fb.fill_rect  # (x, y, w, h, col)
        self.text = fb.text  # (string, x, y, col=1)
        self.scroll = fb.scroll  # (dx, dy)
        self.blit = fb.blit  # (fbuf, x, y[, key])
        self.init()
        self.flash_timer=Timer(31)
        self.content=[' ']*self.num

    # def _write(self, command, data):
    #     self.cs(0)
    #     for m in range(self.num):
    #         self.spi.write(bytearray([command, data]))
    #     self.cs(1)
    def _write(self,command,data):
        self.cs(0)
        self.spi.write(bytearray([command,data]))
        self.cs(1)

    def init2(self):
        for command, data in (
                (_SHUTDOWN, 0),
                (_DISPLAYTEST, 0),
                (_SCANLIMIT, 7),
                (_DECODEMODE, 0),
                (_SHUTDOWN, 1),
        ):
            self._write(command, data)
    def init(self):
        for command,data in (
                (0x09,0xff), #decode mode BCD
                (0x0a, 0x03), # brightness=3
                (0x0b,0x07), #scan limit=7
                (0x0c, 0x01),# drop mode=1
                (0x0f,0x01) # show test
        ):
            self._write(command,data)
        utime.sleep(1)
        self._write(0x0f,0x00)

    def brightness(self, value):
        if not 0 <= value <= 15:
            raise ValueError("Brightness out of range")
        self._write(_INTENSITY, value)

    def show(self):
        for y in range(8):
            self.cs(0)
            for m in range(self.num):
                self.spi.write(bytearray([_DIGIT0 + y, self.buffer[(y * self.num) + m]]))
            self.cs(1)

    def write_txt(self,txt):
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
            for i in range(self.num):
                self._write(i+1,0xf)
        self._is_flash = not self._is_flash
        if(utime.time()-self.flash_start_time>5):
            t.deinit()
            self._write_txt(self.content_to_show)

    def write_flash_txt(self,txt,interval=300):
        self.flash_timer.deinit()
        self._is_flash=False
        self.flash_start_time=utime.time()
        self.content_to_show=txt
        self.flash_timer.init(mode=Timer.PERIODIC, period=interval, callback=self._flash)

