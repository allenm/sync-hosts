/**
 * author allenm < http://blog.allenm.me >
 * date 2012-5-28
 */

(function ( ) {

    var hostEditor = {

        init:function ( ) {
            hostEditor._initInput( this );
            hostEditor._initItem( this );
        },

        store:function ( ) {
            hostEditor._putTextStored( this.find('.host-input') );
        },

        _initInput:function ( node ) {
            var self = this;
            node.find('.host-input').on('keydown',function ( ev ) {
                var $this = $(this);
                
                // user press enter key , and the cursor in the end
                if( ev.which === 13 && self._isCursorAtEnd( this ) ){
                    ev.preventDefault();
                    self._putTextStored( $this );
                }

                // user press delete key 
                if( ev.which === 8 && self._isCursorAtStart( this ) ){
                    var lastItem = $this.closest('div.edit-area').find('div.item:last'),
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
        _putTextStored:function ( inputNode ) {
            var v = inputNode.val(),
                items = v.split('\n');

            this._addItems( inputNode,  items );
            inputNode.val('');
        },

        _escape:function ( str ) {
            return str.replace(/[<"']/g, function(s) {
                switch (s) {
                    case '"':
                        return '&quot;';
                    case "'":
                        return '&#39;';
                    case '<':
                        return '&lt;';
                    case '&':
                        return '&amp;';
                    default:
                        return s;
                }
            });
        },

        _addItems:function ( inputNode , items ) {
            var html = [],
                self = this;
            $.each( items , function ( i, item ) {
                if( item ){
                    if( item.charAt(0) !== '#' ){
                        html.push('<div class="item clearfix"><span class="data">'+self._escape(item)+'</span><a href="#" class="delete">\u00d7</a></div>');
                    }else{
                        html.push('<div class="unactive-item item clearfix"><span class="data">'+self._escape(item)+'</span><a href="#" class="delete">\u00d7</a></div>');
                    }
                }
            });
            inputNode.closest('div.edit-area').find('div.stored').append( html.join('') );
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

        _initItem:function ( node ) {
            node.on('click','div.item',function ( ev ) {
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
        }


    }

    $.fn.hostEditor = function ( method ) {
        // Method calling logic
        if ( hostEditor[method] ) {
          return hostEditor[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
          return hostEditor.init.apply( this, arguments );
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }   

        return this;
    };
    
})( jQuery );
