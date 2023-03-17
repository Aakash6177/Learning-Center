#This is the Class Info Scraper -> Gets the Name, Units, When the class is offered, and repeatability
#This was made by Eric 
#Do be sure to edit it if you need to!

#Libraries that for python use
#Make sure you have python, Beautifulsoup, and Requests installed
from urllib.request import urlopen
from bs4 import BeautifulSoup 
import requests 

#Got all of the information from the catalog, Below is the URL
urlToScrape = "http://www.fresnostate.edu/catalog/courses-by-department/computer-science/"
urlToScrape = "https://docs.google.com/spreadsheets/d/1c9ulWY3L3aeC2TSHTLtYVmIX7SnO8N0XQHvRmcJuG-k/edit#gid=1781032468&range=I8"
requestPage = urlopen(urlToScrape) #Open the url
pageIntohtml = requestPage.read()  #Read the url and store it as a variable
requestPage.close()                #Closing the url

soup = BeautifulSoup(pageIntohtml, 'html.parser') #Parses the HTML into python to use

#This is the file creation part of the code, just making an excel sheet, basically.
csciData = 'csciData.csv'             #This is the name of the file, it will be in the form of a CSV file but can be read as an excel sheet
csciFile = open(csciData, 'w')        #Opening the file so we can fill it with data
headers = 'Names, Units, Usually Offered In: , Additional Information \n' #These are the headers that will be at the top of the excel sheet
csciFile.write(headers)               #Writing in the headers
#NOTE: COMMAS WILL CREATE A NEW CELL TO THE RIGHT OF THE CURRENT CELL 

#This is essentially what we needed to get all the classes.
csciMainContent = soup.find_all('h6')

#This for loop will load all the data into a the excel sheet
for data in csciMainContent:
    names = data.text                                               #Names of the classes
    substitute = data.nextSibling.nextSibling                       #This is the description, we can add it if you guys want
    courseAttributes = substitute.nextSibling.nextSibling.text      #This is the Units, when the classes are offered, and repeatability
    csciFile.write(names + ',' + courseAttributes + '\n')           #Adding info into our Excel Sheet

