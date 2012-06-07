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

        print workspace
        self.cursor.execute('INSERT INTO workspace ( hosts ) VALUES( ? )', (workspace,) )
        self.conn.commit()

    def getWorkSpace( self ):
        u'''获取工作区内容'''
        
        self.cursor.execute("SELECT * FROM workspace ORDER BY id DESC LIMIT 1")
        return self.cursor.fetchone()

    def getActiveHosts( self ):
        u''' 获取有效的 hosts '''
        workspace = self.getWorkSpace()
        activeHost = []
        groupFlag = "{{group:"
        if workspace :
            hostList = workspace[1].split('\n')
        else:
            hostList = []

        for x in hostList:
            if x.startswith('#'):
                continue
            elif x.startswith( groupFlag ):
                offset = x.find("|")
                if offset is not -1:
                    groupId = x[ len(groupFlag): offset ]
                    activeHost += self.getGroupCont( groupId ).split('\n')
                else:
                    continue
            else:
                activeHost.append(x)

        return activeHost




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

    def getGroupCont( self, groupId ):
        u"""获取分组hosts"""
        self.cursor.execute("SELECT hosts FROM groups WHERE id=?",(groupId,))
        result = self.cursor.fetchone()
        if result and result[0]:
            return result[0]
        else:
            return ""


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
