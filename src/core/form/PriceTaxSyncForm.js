/**
 * Netto Brutto sync form
 * 
 * @class Hatimeria.core.form.PriceTaxSyncForm
 * @extends Ext.form.Panel
 */
(function() {
    
    Ext.define('Hatimeria.core.form.PriceTaxSyncForm', {
        extend: 'Ext.form.Panel',
        config: {

            /**
             * Tax rate
             * @cfg {Number} vat
             */
            vat: 23,

            /**
             * Name of netto field
             * @cfg {String} nettoFieldName
             */
            nettoFieldName: 'netto',

            /**
             * Name of brutto field
             * @cfg {String}
             */
            bruttoFieldName: 'brutto',

            /**
             * validate for price == 0
             * @cfg {bool}
             */
            validation: false
        },



        /**
         * Constructor
         * 
         * @private
         * @param {} config
         */
        constructor: function(config)
        {
            this.initConfig(config);
            this.callParent([config]);
        },
        
        /**
         * Initialize components
         * 
         * @private
         */
        initComponent: function()
        {
            var me = this;
            var config = {
                layout: 'hbox',
                border: 0,
                defaults: {
                    xtype: 'textfield',
                    labelWidth: 40,
                    allowBlank: false,
                    size: 5
                },
                items: [
                    {
                        itemId: 'field-netto',
                        fieldLabel: 'netto',
                        name: this.getNettoFieldName(),

                        labelStyle: 'margin-right: 5px',
                        margin: '0 10 0 0',
                        listeners: {
                            change: {
                                scope: this,
                                fn: this.onNettoChange
                            }
                        },
                        validator: function(value) {
                            if (me.validation === true) {
                                if (value <= 0 ) {
                                    return 'Price must be greater than zero'
                                } else {
                                    return true;
                                }
                            }
                        }
                    },
                    {
                        itemId: 'field-brutto',
                        fieldLabel: 'brutto',
                        name: this.getBruttoFieldName(),
                        labelStyle: 'margin-right: 5px',
                        listeners: {
                            change: {
                                scope: this,
                                fn: this.onBruttoChange
                            }
                        }
                    }
                ]
            };
            Ext.apply(this, Ext.apply(config, this.initialConfig));
            this.callParent();
        },
        
        /**
         * Event: netto field changed
         * 
         * @private
         * @param {Ext.form.field.Text} field
         * @param {String} value
         */
        onNettoChange: function(field, value)
        {
            value = parseFloat(value);
            var brutto;
            
            brutto = (isNaN(value)) ? '' : (value * (1+this.getPercent()).toFixed(2))
            
            this.getComponent('field-brutto').setRawValue(brutto);
        },
        
        /**
         * Event: brutto field changed
         * 
         * @private
         * @param {Ext.form.field.Text} field
         * @param {String} value
         */
        onBruttoChange: function(field, value)
        {
            value = parseFloat(value);
            var netto;
            
            /**
             *  value  -  123%
             *  x      -  100
             */
            
            netto = (isNaN(value)) ? '' : (((100 * value) / (100 + this.getVat())).toFixed(2));
            this.getComponent('field-netto').setRawValue(netto);
        },
        
        /**
         * Tax percentage
         * 
         * @return {Double}
         */
        getPercent: function()
        {
            return this.getVat() / 100;
        }
    });
    
})();
