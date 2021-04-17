
CONFIG={}
config_file = 'proof_box.config'
def read_config():
    with open(config_file,'r') as fh:
        for line in fh:
            line = line.strip()
            if(len(line)>0):
                print(line)
                key,val = line.split('=')
                CONFIG[key.strip()] = val.strip()
    print('read config done.')

def save_config():
    with open(config_file,'w') as fh:
        for k,v in CONFIG.items():
            fh.write('{}={}\n'.format(k,v))

MSG_TYPE_INIT=0
MSG_TYPE_STATUS=1
MSG_TYPE_START=2
MSG_TYPE_STOP=3
MSG_TYPE_CAPTURE=5
MSG_TYPE_ERROR=10
MSG_TYPE_CLIENT_STATUS=20
MSG_TYPE_CHANGE_SETTINGS=21
MSG_TYPE_MANUAL_OPERATION=22

OPERATION_RESET=30
OPERATION_POWER_DOWN=31

SETTINGS_MIN_TEMP='min_temp'
SETTINGS_MAX_TEMP='max_temp'
SETTINGS_MIN_HUMI='min_humi'
SETTINGS_MAX_HUMI='max_humi'
SETTINGS_PROOF_MATERIAL='proof_material'
SETTINGS_NO_INTERAL_FAN = 'no_interal_fan'

STATUS_PREPARE=0
STATUS_PROOFING=2
STATUS_WAITING=1

from message_center import MessageCenter



