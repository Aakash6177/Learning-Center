#Install pandas -> pip install pandas
import pandas as pd
import json
#https://docs.google.com/spreadsheets/d/1c9ulWY3L3aeC2TSHTLtYVmIX7SnO8N0XQHvRmcJuG-k/edit?pli=1#gid=1468647908
#https://docs.google.com/spreadsheets/d/1c9ulWY3L3aeC2TSHTLtYVmIX7SnO8N0XQHvRmcJuG-k/edit?pli=1#gid=1468647908
sheet_id = '1c9ulWY3L3aeC2TSHTLtYVmIX7SnO8N0XQHvRmcJuG-k' #Sheet Id
gid_id = '1468647908'
#Store data into dataFrame
dataFrame = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid_id}", header=6, index_col=None)

tutoringStatusInfo = []

#Fill the JSON file
i = 0
while i < (dataFrame.size/6):
    tutorStatus = dataFrame.iloc[i,0]
    tutorSubject = dataFrame.iloc[i, 1]
    tutorName = dataFrame.iloc[i, 2]
    tutorDailySchedule = dataFrame.iloc[i, 4]
    tutorUpdates = dataFrame.iloc[i, 5]
    if pd.isna(tutorUpdates):
        tutorUpdates = "NA"

    tutorStatus = {
        "Status": tutorStatus,
        "Subject": tutorSubject,
        "Tutor Name": tutorName,
        "Scheduled Hours Today": tutorDailySchedule,
        "Schedule Updates": tutorUpdates
    }
    tutoringStatusInfo.append(tutorStatus)
    i = i + 1
#Create Json File
with open('tutorDailyData.json', 'w') as f:
    json.dump(tutoringStatusInfo, f)
