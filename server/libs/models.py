#!/usr/bin/env python
# -*- coding: utf-8 -*-
# author allenm < http://blog.allenm.me >
# date 2012-5-23
#

import os
import sqlite3

class HostsStore :

    def __init__(self):
        path = os.path.dirname(__file__)
        dbfile = path + "/hosts.db"
        if not os.path.exists( dbfile ):
            print "**Error** app not installed , please execute tools/install.py first"
            return False

        self.conn = sqlite3.connect( dbfile )
        self.cursor = self.conn.cursor()

    def updateWorkSpace( self, workspace ):
        data = []
        for x in workspace:
            data.append(( x.get("groupid"), x.get("item"), x.get("status",1) ))

        self.cursor.execute("DELETE FROM workspace WHERE 1=1")
        self.cursor.executemany('INSERT INTO workspace VALUES( ?, ?,? )', data )
        self.conn.commit()

    def getWorkSpace( self ):
        
        self.cursor.execute("SELECT * FROM workspace")
        return self.cursor.fetchall()



if __name__ == "__main__":
    hs = HostsStore()
    workspace = [{"groupid":1},{"item":"127.0.0.1 style.china.alibaba.com"}]
    hs.updateWorkSpace( workspace )
    print hs.getWorkSpace()
