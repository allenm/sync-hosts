/**
 * author allenm < http://blog.allenm.me > 
 * date 2012-05-23
 */

(function ( $ ) {

    var hostManage = {
        init:function ( ) {
            this.initInput();
            this.initItem();
            this.initSubmit();
        },

        initInput:function ( ) {
            var self = this;
            $('#host-input').on('keydown',function ( ev ) {
                var $this = $(this);
                
                // user press enter key , and the cursor in the end
                if( ev.which === 13 && self._isCursorAtEnd( this ) ){
                    ev.preventDefault();
                    self._putTextStored();
                }

                // user press delete key 
                if( ev.which === 8 && self._isCursorAtStart( this ) ){
                    var lastItem = $('#edit-area div.item:last'),
                        data = lastItem.find('span.data').text();

                    lastItem.remove();
                    if( $this.val() ){
                        $this.val( data + '\n' + $this.val() );
                    }else{
                        $this.val( data );
                    }
                    if( "setSelectionRange" in this ){
                        this.setSelectionRange( data.length , data.length );
                    }
                    ev.preventDefault();
                }

            });
        },

        // 把 textarea 中的内容放到 stored 区
        _putTextStored:function ( ) {
            var input = $('#host-input'),
                v = input.val(),
                items = v.split('\n');

            this._addItems( items );
            input.val('');
        },

        _isCursorAtEnd:function ( node ) {
            // only support the browser which support selectionStart
            if( "selectionStart" in node ){
                return ( node.selectionStart === node.value.length && node.selectionStart === node.selectionEnd );
            }else{
                return true;
            }
        },

        _isCursorAtStart:function ( node ) {
            // only support the browser which support selectionStart
            if( "selectionStart" in node ){
                return (node.selectionStart === 0 && node.selectionStart === node.selectionEnd );
            }else{
                return false;
            }
        },
        
        
        _addItems:function ( items ) {
            var html = [];
            $.each( items , function ( i, item ) {
                if( item ){
                    if( item.charAt(0) !== '#' ){
                        html.push('<div class="item clearfix"><span class="data">'+item+'</span><a href="#" class="delete">\u00d7</a></div>');
                    }else{
                        html.push('<div class="unactive-item item clearfix"><span class="data">'+item+'</span><a href="#" class="delete">\u00d7</a></div>');
                    }
                }
            });
            $('#edit-area div.stored').append( html.join('') );
        },

        initItem:function ( ) {
            $('#edit-area').on('click','div.item',function ( ev ) {
                var target = ev.target,
                    $this = $(this);

                ev.preventDefault();
                if( $(target).hasClass('delete') ){
                    $this.remove();
                }else if( $this.hasClass('unactive-item') ){
                    $this.removeClass('unactive-item');
                    $this.find('span.data').text( $this.find('span.data').text().replace(/^#+/,"") );
                }else{
                    $this.addClass('unactive-item');
                    $this.find('span.data').text( '#'+$this.find('span.data').text() );
                }
            });
        },

        initSubmit:function ( ) {
            var self = this;
            $('#submit-btn').on('click',function ( ev ) {
                ev.preventDefault();
                self._putTextStored();
                var hosts = [],
                    url = "/update-host";
                $('#edit-area span.data').each(function ( index, item ) {
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
