def wlan_connect(ssid='maotouying', password='1212345678'):
    import network,utime
    wlan = network.WLAN(network.STA_IF)
    if not wlan.active() or not wlan.isconnected():
        wlan.active(True)
        print('connecting to:', ssid)
        cnt=0
        wlan.connect(ssid, password)
        while not wlan.isconnected() and cnt<30:
            cnt+=1
            utime.sleep(1)
            pass
    if(wlan.isconnected()):
        print('network config:', wlan.ifconfig())
        import ntptime,utime
        ntptime.host = 'cn.pool.ntp.org'
        ntptime.NTP_DELTA -=8*60*60
        for _ in range(15):
            try:
                ntptime.settime()
                break
            except:
                utime.sleep(1)
    else:
        print('connecting fail')

