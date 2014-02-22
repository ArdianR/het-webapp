Ext.define('MSarana', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: ['id', 'nama', 'kode_sarana', 'alamat', 'no_telp', 'id_pengawas', 'nama_pengawas'],
    validations: [{
        type: 'length',
        field: 'nama',
        min: 1
    }, {
        type: 'length',
        field: 'kode_sarana',
        min: 1
    }, {
        type: 'length',
        field: 'alamat',
        min: 1
    }, {
        type: 'length',
        field: 'no_telp',
        min: 1
    }, {
        type: 'length',
        field: 'id_pengawas',
        min: 1
    }]
});

var DataSarana = new Ext.create('Ext.data.Store', {
    model: 'MSarana',
    autoSync: true,
    pageSize: conf.PAGESIZE,
    defaultSortable: true,
    proxy: {
        type: 'rest',
        url: conf.BASE_URL + 'sarana_pelayanan',
        actionMethods: {create: "POST", read: "GET", update: "PUT", destroy: "DELETE"},
        reader: {type: 'json', root: 'results', totalProperty: 'total'},
        writer: {type: 'json'}
    },
    listeners: {
        write: function( store, operation, eOpts ) {
            store.reload();
        }
    }
});

var rowEditingSarana = Ext.create('Ext.grid.plugin.CellEditing');

var GridSarana = Ext.create('Ext.grid.Panel', {
    store: DataSarana,
    loadMask: true,
    noCache: true,
    forceFit: true,
    features: [{
        ftype: 'searching',
        minChars: 2,
        position: 'top',
        mode: 'remote'
    }],

    plugins: [rowEditingSarana],

    columns: [
    {
        //id, nama, kode_sarana, alamat, no_telp, id_Sarana
        text: 'No.',
        xtype: 'rownumberer',
        width: 35,
        resizable: true,
        itemId: 'no',
        sortable: true
    },
    {
        header: 'Nama Sarana',
        dataIndex: 'nama',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'Kode Sarana',
        dataIndex: 'kode_sarana',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'Alamat',
        dataIndex: 'alamat',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'No Telp',
        dataIndex: 'no_telp',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'Pengawas',
        dataIndex: 'id_pengawas',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    }],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: DataSarana,
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
                DataSarana.insert(0, new MSarana());
                rowEditingSarana.startEdit(0, 1);
            }
        }, '-', {
            text: 'Delete',
            iconCls: 'icon-delete',
            handler: function(){
                var selection = GridSarana.getView().getSelectionModel().getSelection()[0];
                if (selection) {
                    DataSarana.remove(selection);
                }
            }
        }]
    }]
});