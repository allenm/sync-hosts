/**
 * author allenm < http://blog.allenm.me > 
 * date 2012-05-23
 */

(function ( $ ) {

    var hostManage = {
        init:function ( ) {
            this.initWorkingEditor();
            this.initSubmit();
        },

        initWorkingEditor:function ( ) {
            $('#working-edit-area').hostEditor();
        },

        initSubmit:function ( ) {
            var self = this;
            $('#submit-btn').on('click',function ( ev ) {
                ev.preventDefault();
                $('#working-edit-area').hostEditor('store');
                var hosts = [],
                    url = "/update-host";
                $('#working-edit-area span.data').each(function ( index, item ) {
                    hosts.push( $(this).text() );
                });

                $.ajax( url, {
                    type:"POST",
                    data: {
                        host: hosts.join('\n')
                    },
                    dataType:"json"
                }).done(function ( data ) {
                    if( data.success === true ){
                        self.toast("同步成功");
                    }else{
                        self.toast("同步失败","warning");
                    }
                });


            });
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
        hostManage.init();
    });
    
})( jQuery );
