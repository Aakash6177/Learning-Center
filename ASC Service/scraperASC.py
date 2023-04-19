#Libraries that for python use
#Make sure you have python, BeautifulSoup, bs4, and Requests installed
from urllib.request import urlopen
from bs4 import BeautifulSoup
import requests
import json

#Got all of the information from the catalog, Below is the URL
urlToScrape = "https://studentaffairs.fresnostate.edu/lrc/asc/featurestory.html"
requestPage = urlopen(urlToScrape) #Open the url
pageIntoHtml = requestPage.read()  #Read the url and store it as a variable
requestPage.close()                #Closing the url

soup = BeautifulSoup(pageIntoHtml, 'html.parser') #Parses the HTML into python to use

ascInformation = []
#This is essentially what we needed to get.
ascMainContent = soup.find_all('div', class_="col-lg-4 text-center")

#This for loop will load all the data into a the excel sheet
for data in ascMainContent:
    #Stores all data in side of this
    ascCoachData = {}
    #Get the Subject
    ascCoachImageTag = data.find('img')
    ascCoachImageSrc = "https://studentaffairs.fresnostate.edu" + ascCoachImageTag['src']
    ascCoachNameTag = data.find('p', class_="h5 pt-3")
    ascCoachName = ascCoachNameTag.text
    #Create the entry
    ascCoachData["Coach Name"] = ascCoachName
    ascCoachData["Image Source"] = ascCoachImageSrc
    #Fill the JSON file
    ascInformation.append(ascCoachData)

with open('ascData.json', 'w') as f:
    json.dump(ascInformation, f)
