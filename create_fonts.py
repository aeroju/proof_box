import gen
#
# font=gen.generate_oled_font('Arial',32,{'0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9','D':'º','/':'/','%':'%'})
# print(font)

chinese={'M1':'\u4e00'}
print(gen.generate_oled_font('楷体-简',16,chinese))

# cs={}
# for i in range(32, 127):
#     cs[chr(i)]=chr(i)
# font = gen.generate_oled_font("Arial", 16,cs) #any instaled font at any size
# print(font)