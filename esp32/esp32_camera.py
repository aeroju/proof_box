
import camera
import uasyncio as asyncio


def capture():
    camera.init(0, format=camera.JPEG)
    await asyncio.sleep(2)

    n_try = 0
    buf = False
    while (n_try < 10 and buf == False): #{
        # wait for sensor to start and focus before capturing image
        buf = esp32_camera.capture()
        if (buf == False): await asyncio.sleep(2)
        n_try = n_try + 1

    camera.deinit()
    if(buf==False):
        return None
    return buf
