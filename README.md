sync-hosts 介绍：
=======================

做 web developer 的经常需要开几个虚拟机，分别测试那可恶的 ie6,7,8 等浏览器，在开发环境中，我们又经常需要绑定 hosts 来访问开发、测试环境
这个项目就是来帮助解决要在多个地方修改 hosts 的问题，用一个 web 界面来管理多台机器的 hosts 绑定，做到实时同步。

目前还只是一个可以工作的原型，想尝鲜的可以按照下面步骤来尝试：

1.  client 和 server 端都需要 python 运行环境，server 端未在 windows 系统测试过，client 端在 Mac，windows 上测试过。
2.  client 端依赖 websocket-client 包
3.  server 端依赖 tornado
4.  解决好依赖后，运行 server.py ， 在 client 上，配置 config.json 修改 server 地址和端口，server 端口默认为 8888，运行 client 的 main.py
5.  看到 main.py 打印出 open ，表示连接 server 成功
6.  用浏览器访问 server, 例如 localhost:8888 然后在 web 界面上填上 hosts ，点击更新。

注意：
-------------------
此工具不会改动 client 端已有的 hosts 配置，只会在后面追加，和抹掉上一次由此工具生成的配置。
