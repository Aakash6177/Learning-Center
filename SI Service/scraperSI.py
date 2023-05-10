#Libraries that for python use
#Make sure you have python, BeautifulSoup, bs4, and Requests installed
from urllib.request import urlopen
from bs4 import BeautifulSoup
import requests
import json

#Got all of the information from the catalog, Below is the URL
urlToScrape = "https://studentaffairs.fresnostate.edu/lrc/suppinstruction/si-schedule.html"
requestPage = urlopen(urlToScrape) #Open the url
pageIntoHtml = requestPage.read()  #Read the url and store it as a variable
requestPage.close()                #Closing the url

soup = BeautifulSoup(pageIntoHtml, 'html.parser') #Parses the HTML into python to use

siInformation = []
#This is essentially what we needed to get.
siMainContent = soup.find_all('table', class_="table table table-striped")

#This for loop will load all the data into a the excel sheet
for data in siMainContent[1:]:
    #Get the Subject
    siSubjectTag = data.find('caption')
    siSubject = siSubjectTag.text
    siSubject = siSubject.removeprefix("SI Leaders for ")
    siSubject = siSubject.removesuffix("\u00a0")
    siTableBody = data.find('tbody')
    siTableRow = siTableBody.find_all('tr')
    for siContent in siTableRow: #There Should be 3 columns per row
        #Stores all data in side of this
        siLeaderInfo = {}
        siLeaderInfo["Subject"] = siSubject
        #First Column
        siTds = siContent.find_all('td')
        siTableColOne = siTds[0]
        siNameTag = siTableColOne.find('strong')
        if not siNameTag:
            siNameTag = siTableColOne.find('b')
        siName = siNameTag.text
        siName = siName.removesuffix("\u00a0")
        siLeaderInfo['SI Leader'] = siName
        siPronounsTag = siTableColOne.find('em')
        siPronouns = siPronounsTag.text
        siPronouns = siPronouns.removesuffix("\u00a0")
        siLeaderInfo['Pronouns'] = siPronouns
        siImageSrcTag = siTableColOne.find('img')
        siImageSrc = "https://studentaffairs.fresnostate.edu" + siImageSrcTag['src']
        siLeaderInfo['Image Url'] = siImageSrc

        #Second Column
        siTableColTwo = siTds[1]
        siInstructorTag = siTableColTwo.select_one('p')
        if siInstructorTag is not None:
            siInstructor = siInstructorTag.text
        else:
            siInstructor = siTableColTwo.text
        siInstructor = siInstructor.removesuffix("\u00a0")
        siLeaderInfo["Instructor"] = siInstructor

        #Third Column
        siTableColTree = siTds[2]
        siPs = siTableColTree.select('p')
        siSessionOne = siPs[1].text
        siSessionTwo = siPs[2].text
        siSessionOne = siSessionOne.removesuffix("\u00a0")
        siSessionTwo = siSessionTwo.removesuffix("\u00a0")
        siLeaderInfo["Session One"] = siSessionOne
        siLeaderInfo["Session Two"] = siSessionTwo
        siOfficeHourOne = siPs[4].text
        siOfficeHourTwo = siPs[5].text
        siOfficeHourOne = siOfficeHourOne.removesuffix("\u00a0")
        siOfficeHourTwo = siOfficeHourTwo.removesuffix("\u00a0")
        siLeaderInfo["Office Hour One"] = siOfficeHourOne
        siLeaderInfo["Office Hour Two"] = siOfficeHourTwo
        siZoomLinkTags = siTableColTree.find('a')
        if siZoomLinkTags is not None:
            siZoomLink = siZoomLinkTags['href']
        else:
            siZoomLink = "NA"
        siLeaderInfo["Zoom Link"] = siZoomLink

        siInformation.append(siLeaderInfo)

with open('siData.json', 'w') as f:
    json.dump(siInformation, f)


siDailyInformation = []
#Get the Subject
siDailyCancellations = soup.find('div', class_="table-responsive")
# siSubjectBody = siDailyCancellations.find('tbody')
siTableRow = siDailyCancellations.find_all('tr')
for siContent in siTableRow[1:]: #There Should be 3 columns per row
    #Stores all data in side of this
    siLeaderInfo = {}
    siLeaderSubject = siContent.find_all("td")
    print(siLeaderSubject)
    siLeaderInfo["Subject"] = siLeaderSubject[0].text
    siLeaderInfo["SI Leader"] = siLeaderSubject[1].text
    siLeaderInfo["Notes"] = ""
    siNotes = siLeaderSubject[2].find_all("p")
    for siNote in siNotes:
        siLeaderInfo["Notes"] += siNote.text + " <br>"
    siDailyInformation.append(siLeaderInfo)

with open('siDailyData.json', 'w', encoding='utf-8') as f:
    json.dump(siDailyInformation, f)


