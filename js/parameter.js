Ext.define('MParameter', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: ['id', 'kode', 'isi'],
    validations: [{
        type: 'length',
        field: 'kode',
        min: 1
    }, {
        type: 'length',
        field: 'isi',
        min: 1
    }]
});

var DataParameter = new Ext.create('Ext.data.Store', {
    model: 'MParameter',
    autoSync: true,
    pageSize: conf.PAGESIZE,
    defaultSortable: true,
    proxy: {
        type: 'rest',
        url: conf.BASE_URL + 'parameter',
        //actionMethods: {create: "POST", read: "GET", update: "PUT", destroy: "DELETE"},
        reader: {type: 'json', root: 'results', totalProperty: 'total'},
        writer: {type: 'json'}
    },
    listeners: {
        write: function( store, operation, eOpts ) {
            store.reload();
        }
    }
});

var rowEditingParameter = Ext.create('Ext.grid.plugin.CellEditing');

var GridParameter = Ext.create('Ext.grid.Panel', {
    store: DataParameter,
    loadMask: true,
    noCache: true,
    forceFit: true,

    plugins: [rowEditingParameter],

    columns: [
    {
        text: 'No.',
        xtype: 'rownumberer',
        width: 35,
        resizable: true,
        itemId: 'no',
        sortable: true
    },
    {
        header: 'Kode',
        dataIndex: 'kode',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'Isi Parameter',
        dataIndex: 'isi',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    }],

    features: [{
        ftype: 'searching',
        minChars: 2,
        position: 'top',
        mode: 'remote'
    }],

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: DataParameter,
        dock: 'bottom',
        displayInfo: true
    }, {
        xtype: 'toolbar',
        items: [
        {
            text: 'Add',
            iconCls: 'icon-add',
            handler: function(){
                // empty record
                DataParameter.insert(0, new MParameter());
                rowEditingParameter.startEdit(0, 1);
                GridParameter.getView().refresh();
            }
        }, '-', {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: function(){
                var selection = GridParameter.getView().getSelectionModel().getSelection()[0];
                if (selection) {
                    DataParameter.remove(selection);
                    DataParameter.reload();
                }
            }
        }]
    }]
});