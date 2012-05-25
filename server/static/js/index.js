/**
 * author allenm < http://blog.allenm.me > 
 * date 2012-05-23
 */

(function ( $ ) {

    var updateHost = {

        timer:null,

        init:function ( ) {
            this._initUpdate();
            /*this._getLastHost();*/
        },
        _initUpdate:function ( ) {
            var self = this;
            $('#update-form').on('submit',function ( ev ) {
                ev.preventDefault();
                var $form = $(this),
                    host = $form.find('textarea').val();
                $.ajax( $form.attr('action'),{
                    type:"POST",
                    data: { host:host },
                    dataType:'json'

                }).done(function ( data ) {
                    if( data.success === true ){
                        window.localStorage.setItem('host',host);
                        self.toast("同步成功");
                    }else{
                        self.toast("同步失败","warning");
                    }
                });
            });
        },

        _getLastHost:function ( ) {
            var host = window.localStorage.getItem('host');
            $('#update-form textarea').val( host );
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

    $( function ( ) {
        updateHost.init();
    });

})( jQuery );
