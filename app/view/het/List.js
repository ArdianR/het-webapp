Ext.define('HET.view.het.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.hetlist',
    title: 'Daftar Het',

    features: [{
        ftype: 'summary',
        dock: 'bottom'
    }],

    initComponent: function() {
        this.store = {
            fields: ['nama_obat', 'het', {name: 'jumlah_laporan', type: 'int'}],
            autoDestroy: true,
            autoLoad: {start: 0, limit: 20},
            pageSize: 20,
            defaultSortable: true,
            proxy: {
                type: 'rest',
                url: conf.BASE_URL + 'het',
                actionMethods: {read: "GET"},
                reader: {type: 'json'},
                writer: {type: 'json', encode: false}
            }
        };

        this.columns = [
        {
            text: 'No.',
            xtype: 'rownumberer',
            width: 35,
            resizable: true,
            itemId: 'no',
            sortable: true
        },
        {
            header: 'Nama Obat',
            dataIndex: 'nama_obat',
            flex: 2
        },
        {
            header: 'HET',
            dataIndex: 'het',
            flex: 1,
            align: 'right',
            summaryType: function() {
                return 'Jumlah Pelanggaran';
            },
            renderer: function(data, metaData, record, rowIndex, store) {
                if (Utility.isNormalInteger(data))
                    return parseInt(data, 10).toMoney();
                else
                    return data;
            }
        },
        {
            header: 'Jumlah Laporan',
            dataIndex: 'jumlah_laporan',
            flex: 1,
            summaryType: 'sum',
            renderer: function(data, metaData, record, rowIndex, store, view) {
                if (data > 0) {
                    var id = record.raw.id;
                    return '<a href="#" class="wlapor btn btn-xs btn-danger" data-id-obat="'+id+'">'+data+'</a>';
                }
            },
            summaryRenderer: function(value, summaryData, dataIndex) {
                return value;
            }
        }];

        this.dockedItems = [{
            xtype: 'pagingtoolbar',
            store: this.getStore(),
            dock: 'bottom',
            displayInfo: true
        }];

        this.callParent(arguments);
    },

    viewConfig: {
        //Return CSS class to apply to rows depending upon data values
        getRowClass: function(record, index) {
            var c = record.get('jumlah_laporan');
            if (c > 0) {
                return 'warning-jumlah-laporan';
            }
        }
    }
});