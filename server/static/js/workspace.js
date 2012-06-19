/**
 * author allenm < http://blog.allenm.me > 
 * date 2012-05-23
 */

(function ( $ ) {

    var PubSub = syncHost.PubSub;

    var workSpace = {

        PubSub:null,

        init:function ( ) {
            this.initWorkingEditor();
            this.initPubSub();
            this.initSubmit();
        },

        initWorkingEditor:function ( ) {
            $('#working-edit-area').hostEditor();
        },

        initPubSub:function ( ) {
            this.PubSub = new PubSub('updateHost',$.proxy( this.onMsg, this ));
        },

        onMsg:function ( data ) {
            var self = this;
            if( data.success === true ){
                self.toast("save & sync success");
            }else{
                self.toast("save & sync failure","warning");
            }
        },

        initSubmit:function ( ) {
            var self = this;
            $('#submit-btn').on('click',function ( ev ) {
                ev.preventDefault();
                $('#working-edit-area').hostEditor('store');
                var hosts = $('#working-edit-area').hostEditor('getHosts');
                self.PubSub.send({ host:hosts.join('\n')});
            })

        },

        addGroup:function ( groupId, groupName ) {
            $('#working-edit-area').hostEditor('addStoredItem', '{{group:'+groupId+'|'+groupName+'}}');
        },

        toast:function ( txt, className ) {
            var className = className || "normal";
            if( this.timer ){
                clearTimeout( this.timer );
            }
            $('#toast').html('<span class="'+className+'">'+ txt +'</span>').fadeIn();
            this.timer = setTimeout( function ( ) {
                $('#toast').fadeOut();
            },3000);
        }

    };

    syncHost.init( workSpace );
    syncHost.workSpace = workSpace;
    
})( jQuery );
