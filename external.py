
from urllib2 import Request, build_opener, HTTPCookieProcessor, HTTPHandler
import cookielib

def extractHtml(url):
    #Create a CookieJar object to hold the cookies
    cj = cookielib.CookieJar()
    #Create an opener to open pages using the http protocol and to process cookies.
    opener = build_opener(HTTPCookieProcessor(cj), HTTPHandler())

    return opener.open(Request(url)).read()
