#!/usr/bin/env python
# -*- coding: utf-8 -*-
# author allenm < http://blog.allenm.me >
# date 2012-5-23
#

import os
import sys
import websocket
import thread
import time
import json
import ConfigParser

abspath = os.path.dirname(__file__)
sys.path.append( abspath + os.sep +"libs" )
os.chdir( abspath )

import writehosts as wh

ws = None

def init():
    global ws
    websocket.enableTrace( True )
    print "ws://"+ getConfig("server") +"/client/"+ getConfig("key")
    ws = websocket.WebSocketApp("ws://"+ getConfig("server") +"/client/"+ getConfig("key"),
            on_message = on_message,
            on_error = on_error,
            on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()


def on_open( ws ):
    print "### websocket open ###"

def on_message( ws, message ):
    hosts = json.loads( message )
    print hosts
    if( hosts.get("action",None) == "updateHost" ):
        writeHost( hosts.get("hosts",[]) )
        ws.send(json.dumps({ "success":True, "serialNo":hosts.get("serialNo",0) }))


def on_error( ws, error ):
    print error

def on_close( ws ):
    print "### closed ###"
    time.sleep(1)
    init()

def writeHost( hosts ):
    wh.writeHost( hosts )

def getConfig( op ):
    try:
        config = ConfigParser.ConfigParser()
        config.read('config.conf')
        return config.get('main', op )
    except:
        print "config file error , %s not exist" % op
        return ""

if __name__ == "__main__":
    init()
