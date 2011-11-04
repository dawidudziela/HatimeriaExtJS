/** 
 * ComboBox
 */
(function() {
    
    Ext.require('Hatimeria.core.response.DirectHandler');
    
    Ext.define('Hatimeria.core.field.CategoryComboBoxTree', {
        extend: 'Ext.tree.Panel',
        
        startWidth: undefined,
        
        initComponent: function()
        {
            var config = {
                floating: true,
                title: false,
                width: 200,
                height: 150
            };
            
            Ext.apply(this, Ext.apply(config, this.initialConfig || {}));
            this.callParent();
        },
        
        /**
         * Selects current node
         * 
         * @param Ext.data.Store.ImplicitModel
         */
        getNode: function()
        {
            
        }
    });
    
    Ext.define('Hatimeria.core.field.CategoryComboBoxStore', {
        extend: 'Ext.data.TreeStore',
        
        paramsAsHash: true,
        
        /**
         * Loads all nodes
         * 
         * @param {} nodes
         */
        loadNodes: function(nodes)
        {
            this.getRootNode().appendChild(nodes);
            this.fireEvent('load', this);
        },
        
        /**
         * Count of nodes (always one)
         * 
         * @return int
         */
        getCount: function()
        { 
            return 1; 
        },
        
        /**
         * Search node
         */
        findExact: function(field, value)
        {
            var find = function(nodes, field, value)
            {
                for (var i in nodes)
                {
                    if (nodes[i].get(field) == value)
                    {
                        return nodes[i];
                    }
                    else
                    {
                        return find(nodes[i].childNodes, field, value);
                    }
                }
            };
            
            var record = find(this.getRootNode().childNodes, field, value);
            
            return record;
        },
        
        /**
         * Get node from a pases position
         */
        getAt: function(record)
        {
            return record;
        }
    });
    
    
    Ext.define('Hatimeria.core.field.CategoryComboBox', {
        extend: 'Hatimeria.core.field.DeferComboBox',
        alias: 'widget.ux-category',
        config: {
            directFn: Ext.emptyFn
        },
        
        /**
         * Constructor
         */
        constructor: function(config)
        {
            this.initConfig(config);
            this.callParent([config]);
            
            return this;
        },
        
        /**
         * Initialize component
         */
        initComponent: function()
        {
            var _this = this;
            var config = {
                valueField: 'id',
                queryMode: 'local',
                displayField: 'text',
                store: Ext.create('Hatimeria.core.field.CategoryComboBoxStore', {
                    root: {
                        id: 'root',
                        expanded: true,
                        text: 'Wszystkie',
                        children: []
                    }
                })
            };
            
            Ext.apply(this, Ext.apply(config, this.initialConfig || {}));
            this.callParent();
            
            this.on('afterrender', function() {
                Ext.create('Hatimeria.core.response.DirectHandler', {
                   fn: this.getDirectFn(),
                   scope: this,
                   success: function(result) {
                       var nodes = result.record;
                       var expand = function(nodes)
                       {
                           for (var i in nodes)
                           {
                               nodes[i].expanded = true;
                               if (!nodes[i].children || nodes[i].children.length == 0)
                               {
                                   nodes[i].leaf = true;
                               }
                               expand(nodes[i].children)
                           }
                       }
                       expand(nodes);
                       
                       _this.store.loadNodes(nodes);
                   }
                });
            });
        },
        
        /**
         * Creates a picker
         * 
         * @return Ext.Component
         */
        createPicker: function()
        {
            var picker = Ext.create('Hatimeria.core.field.CategoryComboBoxTree', {
                ownerCt: this.ownerCt,
                store: this.store
            });
            
            this.mon(picker, {
                itemclick: this.onItemClick,
                scope: this
            });
            
            this.mon(picker.getSelectionModel(), {
                selectionChange: this.onListSelectionChange,
                scope: this
            });
            
            this.picker = picker;
            
            return picker;
        }
            
    });
    
})();
