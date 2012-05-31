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
        jsList.append( self.static_url( 'js/global.js' ) )
        jsList.append( self.static_url( 'js/mod/host-editor.js' ) )
        jsList.append( self.static_url( 'js/mod/mustache.js' ) )
        jsList.append( self.static_url( 'js/mod/modal.js' ) )
        jsList.append( self.static_url( 'js/workspace.js' ) )
        jsList.append( self.static_url( 'js/group.js' ) )

        hstore = models.HostsStore()
        workspace = hstore.getWorkSpace()
        if workspace:
            hostsList = workspace[1].split('\n')
        else:
            hostsList = []

        groups = hstore.getGroups()

        self.write(loader.load('index.html').generate( cssList = cssList, jsList = jsList, hostsList = hostsList, groups = groups ))


class updateHost( tornado.web.RequestHandler ):

    def get(self):
        result = { "success": False }
        self.write( json.dumps( result ) )

    def post(self):
        host = self.get_argument("host", default=None )
        if host is not None:

            hstore = models.HostsStore()
            hstore.updateWorkSpace( host )

            activeHosts = hstore.getActiveHosts()

            for c in clientList:
                c.sendHost( activeHosts )

        result = {"success":True }
        self.write( json.dumps( result ) )

class editGroup( tornado.web.RequestHandler ):

    def get(self):
        result = { "success": False }
        self.write( json.dumps( result ) )
    
    def post(self):
        host = self.get_argument("host", default=None)
        groupName = self.get_argument("groupName",default="")
        groupId = self.get_argument("groupId", default = None )

        hstore = models.HostsStore()

        if groupId is None :
            newGroupId = hstore.addGroup( groupName, host )
        else:
            newGroupId = groupId
            hstore.updateGroup( groupId, groupName,  host )

        result = {"success":True, "groupId":newGroupId }
        self.write( json.dumps( result ) )

class delGroup( tornado.web.RequestHandler ):
    def get(self):
        result = { "success": False }
        self.write( json.dumps( result ) )

    def post( self ):
        groupId = self.get_argument("groupId", default = None )

        if groupId is None:
            result = {"success":False, "errMsg":"must supply group id"}
            self.write( json.dumps( result ) )
        else:
            hstore = models.HostsStore()
            hstore.delGroup( groupId )
            result = { "success":True }
            self.write( json.dumps( result ))


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
        (r"/edit-group", editGroup ),
        (r"/del-group", delGroup ),
    ],debug=True, cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
    template_path = abspath+os.sep+'tmpl',
    static_path = abspath+ os.sep + 'static')

if __name__ == "__main__":
    application.listen(8888)
    IOLoop = tornado.ioloop.IOLoop.instance()
    IOLoop.start()
