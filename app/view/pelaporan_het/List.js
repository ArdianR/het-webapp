Ext.define('HET.view.pelaporan_het.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pelaporanHetList',
    autoDestroy: true,

    layout: 'fit',

    title: 'Daftar Pelaporan Het',

    initComponent: function() {
        this.store = {
            fields: ['id_sarana_pelayanan', 'nama_sarana', 'alamat', 'harga', 'stamp'],
            autoLoad: false,
            autoDestroy: true,
            proxy: {
                type: 'rest',
                url: conf.BASE_URL + 'pelaporan_het',
                actionMethods: {read: "GET"},
                reader: {type: 'json', root: 'results', totalProperty: 'total'},
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
            {header: 'Nama Sarana',  dataIndex: 'nama_sarana',  flex: 1},
            {header: 'Alamat',  dataIndex: 'alamat',  flex: 2},
            {
                header: 'Harga Jual',
                dataIndex: 'harga',
                flex: 1,
                renderer: function(value) {
                    return parseInt(value, 10).toMoney();
                }
            },
            {
                header: 'Tanggal Laporan',
                dataIndex: 'stamp',
                flex: 1
            }
        ];

        this.callParent(arguments);
    }
});