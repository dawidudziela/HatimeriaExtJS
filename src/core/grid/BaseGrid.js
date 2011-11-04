/* 
 * BaseGrid
 */
(function() {
    
    Ext.define('Hatimeria.core.grid.BaseGrid', {
        extend: 'Ext.grid.Panel',
        
        initComponent: function()
        {
            this.callParent();
            
            this.on({
                itemcontextmenu: {
                    scope: this,
                    fn: this.onContextMenu
                },
                itemdblclick: {
                    scope: this, 
                    fn: function(grid, record, el, index) {
                        this.onEditClick(record, index);
                    }
                }
            });
        },
        
        /**
         * Items for context menu
         * 
         * @return []
         */
        getContextMenuItems: function(record, index)
        {
            return [
                {
                    text: 'Edytuj',
                    cls: 'ux-edit',
                    scope: this,
                    handler: function() {
                        this.onEditClick(record, index);
                    }
                },
                {
                    text: 'Usuń',
                    cls: 'ux-remove',
                    scope: this,
                    handler: function() {
                        this.onRemoveClick(record, index);
                    }
                }
            ];
        },
        
        /**
         * Event: right click on row
         * 
         * @param Ext.tree.Panel
         * @param Ext.data.Node
         * @param DOMElement el
         * @param int index
         * @param Ext.Object.Event event
         */
        onContextMenu: function(grid, record, el, index, event)
        {
            Ext.create('Ext.menu.Menu', {
                items: this.getContextMenuItems(record, index)
            }).showAt(event.getXY());
            
            event.stopEvent();
        },
        
        /**
         * Event: edit click
         * 
         * @param Ext.data.Model record
         * @param int index
         */
        onEditClick: function(record, index)
        {
            // Abstract
        },

        /**
         * Event: edit click
         * 
         * @param Ext.data.Model record
         * @param int index
         */
        onRemoveClick: function(record, index)
        {
            // Abstract
        }
        
    });
    
})();
