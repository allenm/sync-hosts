#!/usr/bin/env python
# -*- coding: utf-8 -*-
# author allenm < http://blog.allenm.me >
# date 2012-5-23
#

import os
import sys
import sqlite3

def createDB( clean ):
    path = os.path.dirname(__file__)
    dbfile = path + "/../libs/hosts.db"
    if( clean is True ):
        os.remove( dbfile )
        
    conn = sqlite3.connect( dbfile )
    c = conn.cursor()
    c.execute('''CREATE TABLE if not exists groups( id INTEGER PRIMARY KEY AUTOINCREMENT , name TEXT, hosts TEXT, status INTEGER DEFAULT 1 )''')
    #c.execute('''CREATE TABLE if not exists hosts( groupid INTEGER, item TEXT , status INTEGER DEFAULT 1 )''')
    c.execute('''CREATE TABLE if not exists workspace( id INTEGER PRIMARY KEY AUTOINCREMENT , hosts TEXT, status INTEGER DEFAULT 1)''')
    conn.commit()
    c.close()
    conn.close()


if __name__ == "__main__":
    if len( sys.argv ) > 1 and sys.argv[1] == "--clean":
        createDB( True )
    else:
        createDB( False )
