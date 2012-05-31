/**
 * author allenm < http://blog.allenm.me >
 * date 2012-5-30
 * group manage
 */

(function ( $ ) {
    
    var groups = {
        init:function ( ) {
            this.initGroupAction();
            this.initAddGroup();
            this.initGroupEdit();
        },

        initGroupAction:function ( ) {
            var self = this;
            var actionRoute = {
                fold:$.proxy( self._handleFold , self ),
                delete:$.proxy( self._delGroup, self ),
                edit:$.proxy( self._editGroup, self ),
                active:$.proxy( self._activeGroup, self )
            };
            $('#group-wrap').on('click','a.action',function ( ev ) {
                ev.preventDefault();
                var action = $(this).data('action');
                actionRoute[action] && actionRoute[action]( this, ev );
            });
        },

        _activeGroup:function ( el, ev ) {
            var $item = $(el).closest('div.group-item'),
                groupId = $item.data('groupId'),
                groupName = $item.find('a.group-name').text();
            syncHost.workSpace.addGroup( groupId, groupName );
        },

        _editGroup:function ( el, ev ) {
            var $groupItem = $(el).closest('div.group-item');            
            this._showGroupEdit( $groupItem );
        },

        _delGroup:function ( el, ev ) {
            var $groupItem = $(el).closest('div.group-item'),
                groupId = $groupItem.data("groupId");

            if( confirm("Do you want delete this group?") ){

                $.ajax( syncHost.config.api.delGroup, {
                    type:"POST",
                    data:{
                        "groupId":groupId
                    },
                    dataType:"json"
                }).done(function ( data ) {
                    if( data.success ){
                        $groupItem.remove();
                    }
                });
            }else{
            }
            
        },

        _handleFold:function ( el, ev ) {
            var $groupItem = $(el).closest('div.group-item');
            $groupItem.toggleClass('group-item-unfold');
        },

        initAddGroup:function ( ) {
            var self = this;
            $('#add-group-btn').on('click',function ( ev ) {
                ev.preventDefault();
                self._showGroupEdit();
            });
        },


        _showGroupEdit:function ( $groupItem ) {
            var $groupEditModal = $('#group-edit-modal');
            $groupEditModal.modal('show').find('div.edit-area').hostEditor('reset');
            $groupEditModal.find('input.group-name').val('');
            if( $groupItem ){
                $groupEditModal.data('groupItem', $groupItem);
                $groupEditModal.data('action','editGroup');
                $groupEditModal.find('input.group-name').val( $groupItem.find('a.group-name').text());
                var hostList = [];
                $groupItem.find('div.group-body li').each(function ( index, item ) {
                    hostList.push( $(item).text() );
                });
                $groupEditModal.find('textarea').val( hostList.join('\n') );
                $groupEditModal.find('div.edit-area').hostEditor('store');
            }else{
                $groupEditModal.data('groupItem', null);
                $groupEditModal.data('action','addGroup');
            }
        },

        _hideGroupEdit:function ( ) {
            $('#group-edit-modal').modal('hide');
        },

        _groupEditDone:function ( data, groupName , hosts ) {
            var $groupEditModal = $('#group-edit-modal');

            this._hideGroupEdit();

            if( $groupEditModal.data('action') === 'addGroup' ){
                this._renderNewGroup( data, groupName, hosts );
            }else if ( $groupEditModal.data('action') === 'editGroup' ){
                this._renewGroup( $groupEditModal.data('groupItem'), groupName, hosts );
            }
        },

        _renewGroup:function ( $groupItem, groupName, hosts ) {
            $groupItem.addClass('group-item-unfold');
            $groupItem.find('a.group-name').text(groupName);
            var hostHtml = [];
            $.each(hosts, function ( index, item ) {
                hostHtml.push('<li>'+item+'</li>');
            });
            $groupItem.find('div.group-body ul').html( hostHtml.join('') );
        },

        initGroupEdit:function ( ) {
            var $groupEditModal = $('#group-edit-modal'),
                $editArea = $groupEditModal.find('div.edit-area'),
                self = this;
            $groupEditModal.modal({
                keyboard:true,
                show:false
            });
            $editArea.hostEditor();
            $groupEditModal.find('button.cancel').on('click',function ( ev ) {
                ev.preventDefault();
                self._hideGroupEdit();
            });
            $groupEditModal.find('form').on('submit',function ( ev ) {
                ev.preventDefault();
                $editArea.hostEditor("store");
                var $this = $(this);
                var groupName = $this.find('input.group-name').val(),
                    hosts = $editArea.hostEditor('getHosts'),
                    api = syncHost.config.api.editGroup;
                if( $groupEditModal.data('action') == 'editGroup' ){
                    groupId = $groupEditModal.data('groupItem').data('groupId');
                }else{
                    groupId = "";
                }
                $.ajax( api, {
                    type:"POST",
                    dataType:"json",
                    data:{
                        groupName:groupName,
                        host:hosts.join('\n'),
                        groupId:groupId
                    }
                }).done(function ( data ) {
                    if( data.success ){
                        self._groupEditDone( data , groupName, hosts );
                        /*self._renderNewGroup( data, groupName, hosts );*/
                    }
                });

            });
        },

        _renderNewGroup:function ( data , groupName , hosts ) {
            var tmpl = $('#group-item-tmpl').html();
            var html = Mustache.render( tmpl, { groupId:data.groupId, groupName:groupName, hosts:hosts} );
            $('#group-wrap').append( html );
        }
    };

    syncHost.init( groups );
    syncHost.groups = groups;


})( jQuery );
