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

abspath = os.path.dirname(__file__)
sys.path.append( abspath + os.sep +"libs" )
os.chdir( abspath )

import writehosts as wh

def init():
    config = getConfig()
    websocket.enableTrace( True )
    ws = websocket.WebSocketApp("ws://"+ config["server"] +"/host",
            on_message = on_message,
            on_error = on_error,
            on_close = on_close)
    ws.on_open = on_open
    ws.run_forever()


def on_open( ws ):
    print "open"

def on_message( ws, message ):
    print message
    hosts = json.loads( message )
    writeHost( hosts )


def on_error( ws, error ):
    print error

def on_close( ws ):
    print "### closed ###"
    time.sleep(1)
    init()

def writeHost( hosts ):
    wh.writeHost( hosts )

def getConfig():
    c = open('config.json').read()
    config = json.loads( c )
    return config


if __name__ == "__main__":
    init()
