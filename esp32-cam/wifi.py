def wlan_connect(ssid='3-4-102', password='1234567812',retry=10):
    import network,utime
    wlan = network.WLAN(network.STA_IF)
    cnt=0
    if not wlan.active() or not wlan.isconnected():
        wlan.active(True)
        print('connecting to:', ssid)
        wlan.connect(ssid, password)
        while not wlan.isconnected() and cnt<=retry:
            utime.sleep(1)
            cnt+=1
            pass
    print('network config:', wlan.ifconfig())
    return wlan.isconnected()



# ssid='maotouying'
# password='1212345678'
# import network
# wlan = network.WLAN(network.STA_IF)
# wlan.active(True)
# print('connecting to:', ssid)
# wlan.connect(ssid, password)
#
# print('network config:', wlan.ifconfig())
