/**
 * Form
 * 
 * @class Hatimeria.test.form.TestA
 * @extends Hatimeria.core.form.BaseForm
 */
(function() {
    
    Ext.define('Hatimeria.test.form.A.Test2', {
        extend: 'Hatimeria.core.form.BaseForm',
        
        submitConfig: {
            button: false
        },
        
        constructor: function(cfg)
        {
            var config = {
                title: 'Przycisk ukryty',
                frame: true,
                items: [
                   {xtype: 'textfield', name: 'firstname', fieldLabel: 'Imię'},
                   {xtype: 'textfield', name: 'lastname', fieldLabel: 'Nazwisko'},
                   {xtype: 'textfield', name: 'address', fieldLabel: 'Adres'},
                   {xtype: 'textfield', name: 'city', fieldLabel: 'Miasto'},
                   {xtype: 'textfield', name: 'code', fieldLabel: 'Kod'}
                ]
            };
            Ext.apply(config, cfg || {});
            this.callParent([config]);
        }
    });

})();