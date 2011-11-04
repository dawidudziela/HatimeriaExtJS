Ext.define("Hatimeria.core.form.BaseForm", {
    extend: "Ext.form.Panel",
    mixins: {
        translationable: 'Hatimeria.core.mixins.Translationable'
    },
    transDomain: 'HatimeriaExtJSBundle',
    
    /**
     * Initialization
     */
    initComponent: function()
    {
        if (this.submitConfig)
        {
            this.mountSubmit();
        }
        
        this.callParent();
    },
    
    /**
     * Mount submit features
     */
    mountSubmit: function()
    {
        var config = this.submitConfig;
        var submitHandler = Ext.create("Hatimeria.core.response.FormHandler", {
            failureWindowTitle: config.failureWindowTitle || this.__('form.alert_title'),
            success: config.success || function() {},
            formPanel: this
        });
        var submitButton = {
            text: config.text,
            cls: 'ux-button',
            handler: function() {
                var form = this.up('form').getForm();
                if (form.isValid())
                {
                    form.submit(submitHandler);
                }
            }
        };
        
        this.submitHandler = submitHandler;
        
        if (!this.buttons)
        {
            this.buttons = [];
        }
        
        this.buttons.push(submitButton);
    },
    
    /**
     * Gets field by name
     * 
     * @param string name
     */
    getFieldByName: function(name)
    {
        var fields = this.getForm()._fields.items;
        for (var i in fields)
        {
            var field = fields[i];
            if (field.name == name)
            {
                return field;
            }
        }
        
        return false;
    }
});
