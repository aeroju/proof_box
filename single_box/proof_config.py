import uos

class ProofConfig():
    def __init__(self,conf_file):
        self.sensors=[]

        #controls
        self.heaters=[]
        self.fans=[]
        self.powers=[]
        self.humis=[]
        self.frigs=[]
        self.lights=[]

        self.input_keys={}
        self.displays={}
        self.read(conf_file)
        pass

    def read(self,conf_file):
        if(conf_file not in uos.listdir()):
            print('could not find conf file:',conf_file)
            return
        with open(conf_file,'r') as f:
            lines=f.readlines()

        category=None
        for line in lines:
            line=line.strip()
            if(line.startswith('#') or len(line)==0):
                continue
            if(line.find('#')>0):
                line=line[:line.find('#')].strip()
            if line.startswith('[') and line.endswith(']'):
                category=line[1:-1]
                continue
            if(line.find('=')>0):
                if(category=='sensors'):
                    self.read_sensor(line)
                elif(category=='heater'):
                    self.read_heater(line)
                elif(category=='fan'):
                    self.read_fan(line)
                elif(category=='power'):
                    self.read_power(line)
                elif(category=='frig'):
                    self.read_frig(line)
                elif(category=='humi'):
                    self.read_humi(line)
                elif(category=='light'):
                    self.read_light(line)
                elif(category=='input'):
                    self.read_input(line)
                elif(category=='display'):
                    self.read_display(line)
                else:
                    print('unknown category:',line)

    def read_sensor(self,line):
        k,v=line.split("=")
        if(v.find(':')>0):
            st,pin=v.split(':')
            if(st=='sm78'):
                pins=[]
                for p in pin.split(','):
                    pins.append(int(p.strip()))
            elif(st=='dht_22'):
                pins=int(pin)
            else:
                raise Exception('Unknowen sensor type:',line)
            self.sensors.append([k,st,pins])

    def read_heater(self,line):
        k,v=line.split("=")
        self.heaters.append([k,v])

    def read_fan(self,line):
        k,v=line.split("=")
        self.fans.append([k,v])

    def read_power(self,line):
        k,v=line.split("=")
        self.powers.append([k,v])

    def read_frig(self,line):
        k,v=line.split("=")
        self.frigs.append([k,v])

    def read_humi(self,line):
        k,v=line.split("=")
        self.humis.append([k,v])

    def read_light(self,line):
        k,v=line.split("=")
        self.lights.append([k,v])

    def read_input(self,line):
        print(line)
        k,v=line.split('=')
        print(k,':',v)
        self.input_keys=eval(v)

    def read_display(self,line):
        ks=line.split('=')
        try:
            v=int(ks[-1])
            for k in ks[:-1]:
                self.displays[k]=v
        except Exception:
            print('error to parse :',line)

class SetupConfig():
    def __init__(self,setup_file):
        self.setup_file=setup_file
        self.mode='HEATER'
        self.target_temp=25
        self.target_humi=85
        self.tolerance={}
        # self.heater_tolerance=[None,5,-0.5]
        # self.humi_tolerance=[None,10,-2]
        # self.fan_tolerance=[None,-1,-1]

        self.read()

    def read(self):
        with open(self.setup_file,'r') as f:
            lines=f.readlines()
        for line in lines:
            line=line.strip()
            if(line.startswith('#') or len(line)==0):
                continue
            if(line.find('=')>0):
                k,v=line.split('=')
                if(k=='mode'):
                    self.mode=v
                elif(k=='target_temp'):
                    self.target_temp=int(v)
                elif(k=='target_humi'):
                    self.target_humi=int(v)
                else:
                    self.tolerance[k]=eval(v)
        pass

    def list_to_str(self,ls):
        ts=[]
        for i in range(len(ls)):
            if(ls[i]==None):
                ts.append('None')
            else:
                ts.append(str(ls[i]))
        ss=','.join(ts)
        return ''.join(['[',ss,']'])

    def save(self):
        lines=[]
        lines.append('='.join(['mode',self.mode]))
        lines.append('='.join(['target_temp',str(self.target_temp)]))
        lines.append('='.join(['target_humi',str(self.target_humi)]))
        for k,v in self.tolerance.items():
            lines.append('='.join([k,self.list_to_str(v)]))

        with open(self.setup_file,'w') as f:
            for l in lines:
                f.write(''.join([l,'\r\n']))


