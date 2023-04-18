#Install pandas -> pip install pandas
import pandas as pd
import json
#https://docs.google.com/spreadsheets/d/1c9ulWY3L3aeC2TSHTLtYVmIX7SnO8N0XQHvRmcJuG-k/edit?pli=1#gid=1781032468
sheet_id = '1c9ulWY3L3aeC2TSHTLtYVmIX7SnO8N0XQHvRmcJuG-k' #Sheet Id
gid_id = '1781032468'

#Store data into dataFrame
dataFrame = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid_id}", header=6, index_col=None)

tutoringInfo = []

#Fill the JSON file
i = 0
while i < (dataFrame.size/10):
    tutorSubject = dataFrame.iloc[i, 0]
    tutorName = dataFrame.iloc[i, 1]
    tutorMon = dataFrame.iloc[i, 2]
    tutorTue = dataFrame.iloc[i, 3]
    tutorWed = dataFrame.iloc[i, 4]
    tutorThu = dataFrame.iloc[i, 5]
    tutorFri = dataFrame.iloc[i, 6]
    tutorPrimaryCourses = dataFrame.iloc[i, 7]
    tutorSecondaryCourses = dataFrame.iloc[i, 8]
    tutorSpecializations = dataFrame.iloc[i, 9]
    if pd.isna(tutorSpecializations):
        tutorSpecializations = ""

    tutorInfo = {
        "Subject": tutorSubject,
        "Tutor Name": tutorName,
        "Monday": tutorMon,
        "Tuesday": tutorTue,
        "Wednesday": tutorWed,
        "Thursday": tutorThu,
        "Friday": tutorFri,
        "Primary Courses": tutorPrimaryCourses,
        "Secondary Courses": tutorSecondaryCourses,
        "Specializations": tutorSpecializations
    }
    tutoringInfo.append(tutorInfo)
    i = i + 1
#Create Json File
with open('tutorData.json', 'w') as f:
    json.dump(tutoringInfo, f)
