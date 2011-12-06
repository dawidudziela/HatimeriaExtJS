/**
 * Image Form (upload of photo)
 * 
 * @class Hatimeria.core.form.ImageForm
 * @extends Ext.form.Panel
 */
(function() {

    Ext.define('Hatimeria.core.form.ImageForm', {
        extend: 'Ext.form.Panel',
        mixins: {
            translationable: 'Hatimeria.core.mixins.Translationable'
        },
        transDomain: 'HatimeriaExtJSBundle',
        
        config: {
            
            /**
             * Image width
             * 
             * @var int
             */
            imgWidth: 100,
            
            /**
             * Image height
             * 
             * @var 100
             */
            imgHeight: 100,
            
            /**
             * Variable name
             * 
             * @var string
             */
            imgName: 'image',
            
            /**
             * Default image
             * 
             * @var {}
             */
            defaultImage: '',
            
            /**
             * Api for request procedures
             * { submit: function() {}, remove: function() {} }
             */
            api: {},
            
            /**
             * Addition params from outside
             * 
             * @var {}
             */
            params: {}
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
         * Initializes component
         * 
         * @private
         */
        initComponent: function()
        {
            var _this = this;
            
            // Image
            var img = Ext.create('Ext.Img', {
                id: 'image-form-img',
                width: this.getImgWidth(),
                height: this.getImgHeight()
            });
            
            // Upload button
            var uploadBtn = Ext.create('Ext.form.field.File', {
                id: 'image-form-upload',
                allowBlank: true,
                name: this.getImgName(),
                msgTarget: 'none',
                fieldLabel: false,
                buttonText: this.__("form.image.browse"),
                buttonOnly: true,
                baseBodyCls: 'image-form-upload',
                hidden: false,
                listeners: {
                    change: function()
                    {
                        _this.submitImage();
                    }
                }
            });
                       
            // Delete button:
            var deleteBtn = Ext.create('Ext.button.Button', {
                text: this.__("form.image.delete"),
                scope: this,
                handler: function()
                {
                    this.removeImage();
                }
            });
            
            var config = {
                id: 'image-form',
                layout: 'border',
                border: false,
                height: this.getImgHeight() + 5,
                items: [
                    {
                        id: 'image-form-imgcontainer',
                        xtype: 'panel',
                        region: 'west',
                        width: this.getImgWidth() + 5,
                        height: this.getImgHeight() + 5,
                        items: [ img ]
                    },
                    {
                        id: 'image-form-form',
                        region: 'center',
                        padding: '0 0 0 10',
                        border: false,
                        xtype: 'form',
                        method: 'POST',
                        api: {
                            submit: this.getApi().submit
                        },
                        fileUpload: true,
                        layout: 'auto',
                        items: [ 
                            uploadBtn, 
                            deleteBtn,
                            {
                                xtype: 'hiddenfield',
                                id: 'current-image-path',
                                name: this.getImgName()
                            }
                        ]
                    }
                ]
            };
            
            Ext.apply(this, Ext.apply(config, this.initialConfig || {}));
            this.callParent();
            this.addEvents(
                
                /**
                 * @event imageloaded
                 * Fires after load image
                 */
                'imageloaded',
                
                /**
                 * @event imageremove
                 * Fires after image remove
                 */
                'imageremove',
                
                /**
                 * @event beforeload
                 * Fires before image load
                 */
                'beforeload'
            );
        },
        
        /**
         * Sets current image
         * 
         * @param {String} path
         */
        setCurrent: function(path)
        {
            this
                .getComponent('image-form-form')
                .getComponent('current-image-path')
                .setValue(path);
                
            this
                .getComponent('image-form-imgcontainer')
                .getComponent('image-form-img')
                .setSrc(Ext.String.format('{0}?_dc={1}', path, (new Date()).getTime()));
        },
        
        /**
         * Current path
         * 
         * @return {String}
         */
        getCurrent: function()
        {
            return this
                .getComponent('image-form-form')
                .getComponent('current-image-path')
                .getValue();
        },
        
        /**
         * Submits image to temporary folder
         * 
         * @private
         */
        submitImage: function()
        {
            var _this = this;
            this.fireEvent('beforeload', this);
            this.getComponent('image-form-form').submit({
                params: this.getParams(),
                success: function(form, response) {
                    _this.setCurrent(response.result.record);
                    _this.fireEvent('imageloaded', response.result);
                }
            });
        },
        
        /**
         * Removes image
         */
        removeImage: function()
        {
            var _this = this;
            if (typeof this.getApi().remove == 'function')
            {
                this.getApi().remove({}, function(form, response) {
                    _this.fireEvent('imageremove', response);
                    _this.setCurrent(_this.getDefaultImage());
                });
            }
            else
            {
                _this.fireEvent('imageremove');
                _this.setCurrent(_this.getDefaultImage());
            }
        },
        
        /**
         * Current data
         * 
         * @return {String}
         */
        getSubmitData: function()
        {
            var data = {};
            data[this.getImgName()] = this.getCurrent();
            
            return data;
        }
        
    });

})();
