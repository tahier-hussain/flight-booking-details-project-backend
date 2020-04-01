#!/usr/bin/env python3
import random
from datetime import datetime
f = open("Logfile", "a+")
data = open("Logfile", "r")

index = 1
ip = []
var1 = []
var2 = []
var3 = []
var4 = []
for x in data:
  start = 0
  end = 0
  if x[0]:
    while x[end] != " ":
        end = end + 1
    ip.append(x[start: end])

    start = end
    while(x[start] != "\""):
        start = start + 1
    
    end = start + 1
    while x[end] != "\"":
        end = end + 1
    
    var1.append(x[start + 1: end])

    start = end + 1
    end = end + 1
    while x[end] != "\"":
        end = end + 1
    
    var2.append(x[start: end])

    start = end + 1
    end = end + 1
    while x[end] != "\"":
        end = end + 1

    var3.append(x[start: end])

    start = end + 3
    end = end + 3
    while x[end] != "\"":
        end = end + 1

    var4.append(x[start: end])

# Returns a datetime object containing the local date and time
dateTimeObj = datetime.now()

month = dateTimeObj.month
if(month == 1):
    month = "Jan"
elif month == 2:
    month = "Feb"
elif month == 3:
    month = "Mar"
elif month == 4:
    month = "April"
elif month == 5:
    month = "May"
elif month == 6:
    month = "Jun"
elif month == 7:
    month = "Jul"
elif month == 8:
    month = "Aug"
elif month == 9:
    month == "Sep"
elif month == 10:
    month == "Oct"
elif month == 11:
    month == "Nov"
else:
    month == "Dec"

date = "["+str(dateTimeObj.day)+"/"+month+"/"+str(dateTimeObj.year)+":"+str(dateTimeObj.hour)+":"+str(dateTimeObj.minute)+":"+str(dateTimeObj.second)+" +"+str(dateTimeObj.microsecond)+"]"

new_data = ip[random.randrange(0, len(ip))]+" - - "+date+" \""+var1[random.randrange(0, len(var1))]+"\" "+var2[random.randrange(0, len(var2))]+" \""+var3[random.randrange(0, len(var3))]+"\" \""+var4[random.randrange(0, len(var4))]+"\""

f.write(new_data + "\n")


