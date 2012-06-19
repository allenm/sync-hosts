/**
 * author allenm < http://blog.allenm.me >
 * email menghonglun@gmail.com
 * date 2012-06-08
 */

(function ( $ ) {

    
    var connect = {
        ws:null,

        channels:{},

        callbackCache:{},

        init:function ( ) {
            var server = 'ws://'+ syncHost.config.server +'/webwshandler';
            this.ws = new WebSocket( server );
            this.ws.onopen = $.proxy( this._onopen , this);
            this.ws.onmessage = $.proxy( this._onmessage, this);
            this.ws.onclose = $.proxy( this._onclose, this);
        },

        send:function ( msg ) {
            this.ws.send( msg );
        },

        _onopen:function ( ) {
            console.log( 'ws open' );
            //
        },

        _onmessage:function ( msg ) {
            var self = this;
            if( msg.data ){
                try {
                    var package = JSON.parse( msg.data );
                    var channel = package.channel;
                    if( channel && $.isArray(self.channels[ channel ]) ){
                        $.each( self.channels[ channel ],function ( index, item ) {
                            try {
                                item( package.data );
                            }catch(e){
                                // do nothing
                            }
                        });
                    }
                }catch(e){
                    // do nothing
                }
            }
        },

        _onclose:function ( ) {
            var self = this;
            setTimeout(function ( ) {
                self.init();
            }, 500);
        },
        addChannel:function ( channel, callback ) {
            if( $.isArray(this.channels[channel]) ){
                this.channels[ channel ].append( callback );
            }else{
                this.channels[ channel ] = [ callback ];
            }
        }
    };

    function PubSub( channel, callback ) {
        this.channel = channel || 'main'; 
        if( $.isFunction( callback )){
            this.callback = callback;
        }else{
            this.callback = $.noop;
        }
        this.init();
    }

    PubSub.prototype = {
        init:function ( ) {
            connect.addChannel( this.channel, this.callback );
        },
        send:function ( data ) {
            var self = this;
            var package = {
                channel:self.channel,
                data:data
            };
            connect.send( JSON.stringify( package ) );
        }
    }

    syncHost.init( connect );
    syncHost.PubSub = PubSub;


})( jQuery );
