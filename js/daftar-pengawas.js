Ext.define('MPengawas', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: ['id', 'nama', 'no_hp'],
    validations: [{
        type: 'length',
        field: 'nama',
        min: 1
    }, {
        type: 'length',
        field: 'no_hp',
        min: 1
    }]
});

var DataPengawas = new Ext.create('Ext.data.Store', {
    model: 'MPengawas',
    autoSync: true,
    pageSize: conf.PAGESIZE,
    defaultSortable: true,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        url: conf.BASE_URL + 'pengawas',
        reader: {type: 'json', root: 'results', totalProperty: 'total'},
        writer: {type: 'json'}
    },
    listeners: {
        write: function( store, operation, eOpts ) {
            store.reload();
        }
    }
});

var rowEditingPengawas = Ext.create('Ext.grid.plugin.CellEditing');

var GridPengawas = Ext.create('Ext.grid.Panel', {
    store: DataPengawas,
    loadMask: true,
    noCache: true,
    forceFit: true,
    autoDestroy: true,
    features: [{
        ftype: 'searching',
        minChars: 2,
        position: 'top',
        mode: 'remote'
    }],

    plugins: [rowEditingPengawas],

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
        header: 'Nama Pengawas',
        dataIndex: 'nama',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'No HP',
        dataIndex: 'no_hp',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    }],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: DataPengawas,
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
                DataPengawas.insert(0, new MPengawas());
                rowEditingPengawas.startEdit(0, 1);
            }
        }, '-', {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: function(){
                var selection = GridPengawas.getView().getSelectionModel().getSelection()[0];
                if (selection) {
                    DataPengawas.remove(selection);
                }
            }
        }]
    }]
});