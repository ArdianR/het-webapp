Ext.define('MLogSMS', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: ['id', 'phone_number', 'message', 'sms_center', 'stamp', 'error']
});

var DataLogSMS = new Ext.create('Ext.data.Store', {
    model: 'MLogSMS',
    autoSync: false,
    pageSize: conf.PAGESIZE,
    defaultSortable: true,
    proxy: {
        type: 'rest',
        url: conf.BASE_URL + 'log_sms',
        actionMethods: {read: "GET"},
        reader: {type: 'json', root: 'results', totalProperty: 'total'},
        writer: {type: 'json', encode: false}
    }
});

var GridLogSMS = Ext.create('Ext.grid.Panel', {
    store: DataLogSMS,
    loadMask: true,
    noCache: true,
    forceFit: true,
    features: [{
        ftype: 'searching',
        minChars: 2,
        position: 'top',
        mode: 'remote'
    }],

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
        header: 'No Telp',
        dataIndex: 'phone_number',
        flex: 2
    },
    {
        header: 'Message',
        dataIndex: 'message',
        flex: 2
    },
    {
        header: 'SMS Center`',
        dataIndex: 'sms_center',
        flex: 2
    },
    {
        header: 'Waktu Terima',
        dataIndex: 'stamp',
        flex: 2
    },
    {
        header: 'Error',
        dataIndex: 'error',
        flex: 2,
        renderer: function(value) {
            if (value == 0) {
                return '-';
            } else if (value == 1) {
                return 'Nomor Tidak terdaftar';
            } else if (value == 2) {
                return 'Format SMS Harus KODEOBAT_HARGA';
            } else if (value == 3) {
                return 'Format harga harus harga dan lebih besar dari 0';
            } else if (value == 4) {
                return 'Kode obat tidak terdaftar';
            } else if (value == 5) {
                return 'Harga Obat sesuai dengan het';
            }
        }
    }],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: DataLogSMS,
        dock: 'bottom',
        displayInfo: true
    }],
    viewConfig: {
        //Return CSS class to apply to rows depending upon data values
        getRowClass: function(record, index) {
            var c = record.get('error');
            if (c > 0) {
                return 'warning-jumlah-laporan';
            }
        }
    }
});