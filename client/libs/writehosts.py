#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# author allenm < http://blog.allenm.me >
# date 2012-5-22
# email menghonglun@allenm.me
#

import os
import re

startPattern = re.compile('^#:sync host start')
endPattern = re.compile('^#:sync host end')

def getSysHostPath():
    u"""获取系统 host 文件的路径"""

    if os.name == "nt":
        path = "C:\\Windows\\System32\\drivers\\etc\\hosts"
    else:
        path = "/etc/hosts"

    return path if os.path.isfile( path ) else None

def getHostCont():

    host = getSysHostPath()
    inSyncHost = False
    validHosts = []
    if host != None:
        f = open( host )
        for line in f.readlines():

            if startPattern.search( line ) != None:
                inSyncHost = True
                continue

            if endPattern.search( line ) != None:
                inSyncHost = False
                continue

            if inSyncHost is True:
                validHosts.append( line.strip() )
    return validHosts

def writeHost( hosts ):
    u""" 写入 host ，删除原来的 sync host 控制的 host 记录，在尾部追加上新的"""

    host = getSysHostPath()
    oldContent = []
    inSyncHost = False

    if host == None:
        return False

    f = open( host )
    for line in f.readlines():

        if startPattern.search( line ) != None:
            inSyncHost = True
            continue

        if endPattern.search( line ) != None:
            inSyncHost = False
            continue

        if inSyncHost is True:
            continue

        oldContent.append( line.strip() )

    f.close()
    content = oldContent + ["#:sync host start"] + hosts + ["#:sync host end"]
    f = open(host, 'w')
    f.write( os.linesep.join( content ) )
    f.close()
    return True

    


if __name__ == "__main__":
    host = ["127.0.0.1 style.china.alibaba.com"]
    writeHostCont( host )
