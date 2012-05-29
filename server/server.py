#!/usr/bin/env python
# -*- coding: utf-8 -*-
# author allenm < http://blog.allenm.me >
# email github@allenm.me
# date 2012-5-23
#

import os
import sys
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template
import json
import time

IOLoop = None
abspath = os.path.dirname(__file__)
sys.path.append( abspath + os.sep +"libs" )
os.chdir( abspath )

import models 

clientList = []

class mainHandler( tornado.web.RequestHandler ):
    def get(self):
        loader = tornado.template.Loader( self.get_template_path() )
        cssList = []
        jsList = []
        cssList.append(self.static_url( 'css/reset.css' ))
        cssList.append(self.static_url( 'css/bootstrap.css' ))
        cssList.append(self.static_url( 'css/index.css' ))
        jsList.append("http://lib.sinaapp.com/js/jquery/1.7.2/jquery.min.js")
        jsList.append( self.static_url( 'js/mod/host-editor.js' ) )
        jsList.append( self.static_url( 'js/index.js' ) )

        hstore = models.HostsStore()
        hostsList = hstore.getWorkSpace()

        self.write(loader.load('index.html').generate( cssList = cssList, jsList = jsList, hostsList = hostsList ))


class updateHost( tornado.web.RequestHandler ):

    def get(self):
        result = { "success": False }
        self.write( json.dumps( result ) )

    def post(self):
        host = self.get_argument("host", default=None )
        if host is not None:
            hostList = host.split("\n")
            workspace = [ {"item": x} for x in hostList ]
            hstore = models.HostsStore()
            hstore.updateWorkSpace( workspace )

            for c in clientList:
                c.sendHost( hostList )

        result = {"success":True }
        self.write( json.dumps( result ) )

class hostWSHandler( tornado.websocket.WebSocketHandler ):
    def open( self ):
        print "Websocket opened"
        clientList.append( self )

    def sendHost(self, hosts):
        self.write_message( json.dumps( hosts ) )

    def on_message(self, message):
        print message ;

    def on_close( self ):
        print "Websocket closed"
        clientList.remove(self)


application = tornado.web.Application([
        (r"/", mainHandler),
        (r"/host", hostWSHandler ),
        (r"/update-host", updateHost ),
    ],debug=True, cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    template_path = abspath+os.sep+'tmpl',
    static_path = abspath+ os.sep + 'static')

if __name__ == "__main__":
    application.listen(8888)
    IOLoop = tornado.ioloop.IOLoop.instance()
    IOLoop.start()
