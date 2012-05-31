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
        u'''更新工作区'''
        data = []
        for x in workspace:
            data.append(( x.get("groupid"), x.get("item"), x.get("status",1) ))

        self.cursor.execute("DELETE FROM workspace WHERE 1=1")
        self.cursor.executemany('INSERT INTO workspace VALUES( ?, ?,? )', data )
        self.conn.commit()

    def getWorkSpace( self ):
        u'''获取工作区内容'''
        
        self.cursor.execute("SELECT * FROM workspace")
        return self.cursor.fetchall()

    def addGroup( self, groupName, hosts ):
        u'''添加分组'''
        self.cursor.execute("INSERT INTO groups (name, hosts) VALUES (?,?)", (groupName, hosts))
        self.cursor.execute("SELECT last_insert_rowid()")
        self.conn.commit()
        groupId = self.cursor.fetchone()[0]

        return groupId


    def updateGroup( self, groupId, groupName, hosts ):
        u'''更新特定分组内容'''
        self.cursor.execute("UPDATE groups set name = ? , hosts = ? WHERE id= ?",( groupName, hosts, groupId ))
        self.conn.commit()

    def getGroups( self ):
        u'''获取所有有效分组'''
        self.cursor.execute('''SELECT * FROM groups WHERE status=1''')
        return self.cursor.fetchall()


    def delGroup( self, groupId ):
        u'''删除分组'''
        self.cursor.execute("UPDATE groups SET status = '0' WHERE id=?",( groupId,))
        self.conn.commit()
        return True


if __name__ == "__main__":
    hs = HostsStore()
    workspace = [{"groupid":1},{"item":"127.0.0.1 style.china.alibaba.com"}]
    hs.updateWorkSpace( workspace )
    print hs.getWorkSpace()
