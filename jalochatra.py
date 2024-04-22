print("press x to exit")


names  = {}

while(True):
    
    a = input("Name: ")
    b = input("Amount: ")
    if(a == 'x'):
        break


    names[a]  = b

print("Those who havee donated for Konnagar Jal-O-Chatra 2024")
for key in names.keys():
    print("Name: "+ key + "  Amount: " +names[key]+" Rs.")






