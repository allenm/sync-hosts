/**
 * author allenm < http://blog.allenm.me >
 * date 2012-5-30
 * global file define sth
 */

// define namespace
var syncHost = {};

// config
syncHost.config = {
    api:{
        "updateHost":"/update-host",
        "editGroup":"/edit-group",
        "delGroup":"/del-group"
    },
    server:"localhost:8888"
};

syncHost.init = function ( o ) {
    $(function ( ) {
        o.init && o.init();
    });
};
