
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
MSG_TYPE_CHANGE_SETTINGS=21 #msg body is map like {'target_type':JM,'settings':{}}
MSG_TYPE_MANUAL_OPERATION=22 #msg body is int in following value

OPERATION_RESET=30
OPERATION_POWER_DOWN=31
OPERATION_BEGIN_POWER_DOWN=32
OPERATION_SWITCH_LIGHT=40


SETTINGS_MIN_TEMP='min_temp'
SETTINGS_MAX_TEMP='max_temp'
SETTINGS_MIN_HUMI='min_humi'
SETTINGS_MAX_HUMI='max_humi'
SETTINGS_TARGET_TEMP='target_temp'
SETTINGS_TARGET_HUMI='target_humi'
SETTINGS_PROOF_MATERIAL='proof_material'
SETTINGS_NO_INTERAL_FAN='no_interal_fan'

TARGET_JM=1
JM_SETTING={'target_temp':28,'target_humi':80,'temp_tolerence':[-0.5,1],'humi_tolerence':[-5,5]}
TARGET_F1=2
F1_SETTING={'target_temp':28,'target_humi':80}
TARGET_F2=3
F2_SETTING={'target_temp':28,'target_humi':80}
# STATUS_SHUTTING_DOWN=0


