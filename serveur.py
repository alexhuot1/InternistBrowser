#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from os import curdir, sep
import cgi
from threading import Thread
import simplifier
import external
import sys
import webbrowser

PORT_NUMBER = 8080
server = ""
#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):
	
	#Handler for the GET requests
	def do_GET(self):
		if self.path=="/":
			self.path="/index.html"

		try:
			#Check the file extension required and
			#set the right mime type

			sendReply = False
			if self.path.endswith(".html"):
				mimetype='text/html'
				sendReply = True
			if self.path.endswith(".jpg"):
				mimetype='image/jpg'
				sendReply = True
			if self.path.endswith(".gif"):
				mimetype='image/gif'
				sendReply = True
			if self.path.endswith(".js"):
				mimetype='application/javascript'
				sendReply = True
			if self.path.endswith(".css"):
				mimetype='text/css'
				sendReply = True
			if self.path.endswith(".swf"):
				mimetype='application/x-shockwave-flash'
				sendReply = True
				

			if sendReply == True:
				#Open the static file requested and send it
				f = open(curdir + sep + self.path) 
				self.send_response(200)
				self.send_header('Content-type',mimetype)
				self.end_headers()
				self.wfile.write(f.read())
				f.close()
			return

		except IOError:
			return
		# 	self.send_error(404,'File Not Found: %s' % self.path)

	# #Handler for the POST requests
	def do_POST(self):
		# print "received POST"
		# print self.path
		form = cgi.FieldStorage(
			fp=self.rfile, 
			headers=self.headers,
			environ={'REQUEST_METHOD':'POST',
	                 'CONTENT_TYPE':self.headers['Content-Type'],
		})


		self.send_response(200)
		self.end_headers()
		if form["action"].value == "simplifier":
			self.wfile.write(simplifier.simplifySentences(form["value"].value))
		elif form["action"].value == "extract":
			self.wfile.write(external.extractHtml(form["url"].value))
		elif form["action"].value == "loadCSV":
			self.wfile.write(simplifier.loadCSV(form["csvPath"].value))
		elif form["action"].value == "closeApp":
			print"allo"
			server.socket.close()
		
		return	

# def openBrowser():
	
			
try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print 'Started httpserver on port ' , PORT_NUMBER
	webbrowser.open('http://localhost:8080')
	#Wait forever for incoming htto requests
	#Thread(target=openBrowser).start()
	server.serve_forever()

except KeyboardInterrupt:
	print '^C received, shutting down the web server'
	server.socket.close()
