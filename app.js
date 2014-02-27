Ext.ns('HetApp');

Ext.define('MPelaporanHet', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: ['id', 'nama_obat', 'kode_obat', 'het', 'jumlah_laporan']
});

var DataPelaporanHet = new Ext.create('Ext.data.Store', {
    model: 'MPelaporanHet',
    autoLoad: {start:0, limit: conf.PAGESIZE},
    autoSync: true,
    pageSize: conf.PAGESIZE,
    defaultSortable: true,
    proxy: {
        type: 'rest',
        url: conf.BASE_URL + 'het',
        reader: {type: 'json', root: 'results', totalProperty: 'total'},
        writer: {type: 'json'}
    }
});

var GridPelaporanHet = Ext.create('Ext.grid.Panel', {
    store: DataPelaporanHet,
    autoHeight: true,
    loadMask: true,
    noCache: true,
    forceFit: true,
    layout: {type: 'fit', align: 'stretch'},
    features: [
    {
        ftype: 'searching',
        minChars: 2,
        position: 'top',
        mode: 'remote'
    },
    {
        ftype: 'summary',
        dock: 'bottom'
    }],

    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],

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
        header: 'Nama Obat',
        dataIndex: 'nama_obat',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'Kode Obat',
        dataIndex: 'kode_obat',
        flex: 2,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        }
    },
    {
        header: 'HET',
        dataIndex: 'het',
        flex: 1,
        align: 'right',
        editor: {
            xtype: 'numberfield',
            format:'0.00',
            minValue: 0,
            allowBlank: false
        },
        summaryType: function() {
            return 'Jumlah Pelanggaran';
        },
        renderer: function(data, metaData, record, rowIndex, store) {
            if (Utility.isNormalInteger(data.toString()))
                return parseFloat(data).toMoney();
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
                var id = record.raw.kode_obat;
                return '<a href="#" class="wlapor btn btn-xs btn-danger" data-id-obat="'+id+'">'+data+'</a>';
            }
        },
        summaryRenderer: function(value, summaryData, dataIndex) {
            return value;
        }
    }],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: DataPelaporanHet,
        dock: 'bottom',
        displayInfo: true
    }],

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

Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'HET',

    launch: function() {
        Ext.create('Ext.container.Viewport', {
            id: 'panelUtama',
            renderTo: Ext.getBody(),
            autoWidth: true,
            autoHeight: true,
            border: false,
            layout: {
                type: 'fit',
                align: 'stretch'
            },
            items: [{
                layout: 'anchor',
                items: [
                {
                    id: 'app-header',
                    xtype: 'box',
                    height: 40,
                    style: 'margin-bottom: 30px;',
                    html: '<h1 style="margin: 0;color: #157fcc !important">Aplikasi Monitoring HET</h1>'
                },
                {
                    xtype: 'tabpanel',
                    anchor: '100% 100%',
                    layout: 'fit',
                    padding: '0 20% 0 20%',
                    items: [{
                        id: 'tab-pelaporan',
                        title: 'Pelaporan Het',
                        items: [GridPelaporanHet]
                    }, {
                        id: 'tab-sarana',
                        title: 'Daftar Sarana Pelayanan',
                        items: [GridSarana]
                    }, {
                        id: 'tab-pengawas',
                        title: 'Daftar Pengawas',
                        items: [GridPengawas]
                    },  {
                        id: 'tab-log',
                        title: 'Log SMS',
                        items: [GridLogSMS]
                    }, {
                        id: 'tab-parameter',
                        title: 'Parameter Aplikasi',
                        items: [GridParameter]
                    }],
                    listeners: {
                        tabchange: function(tabpanel, tab) {
                            if (tab.id == 'tab-pelaporan') {
                                DataPelaporanHet.load();
                            } else if (tab.id == 'tab-sarana') {
                                DataSarana.load();
                            } else if (tab.id == 'tab-pengawas') {
                                DataPengawas.load();
                            } else if (tab.id == 'tab-log') {
                                DataLogSMS.load();
                            } else if (tab.id == 'tab-parameter') {
                                DataParameter.load();
                            }
                        }
                    }
                }]
            }]
        });

        Ext.getBody().on('click', function(event, target){
            event.preventDefault();

            var kode_obat = target.getAttribute('data-id-obat')
            ,   obat = GridPelaporanHet.getStore().findRecord('kode_obat', kode_obat).data;

            HetApp.renderWLapor(obat);
        }, null, {delegate: '.wlapor'});

        HetApp.renderWLapor = function(obat) {
            var pelaporanHetList = Ext.create('HET.view.pelaporan_het.List')
            ,   proxy = pelaporanHetList.getStore().getProxy();

            Ext.create('widget.window', {
                title: 'Daftar Pelaporan Obat '+obat.nama_obat+' HET: '+parseInt(obat.het, 10).toMoney(),
                header: {
                    titlePosition: 2,
                    titleAlign: 'center'
                },
                closable: true,
                autoDestroy: true,
                width: 600,
                minWidth: 800,
                height: 350,
                tools: [{type: 'pin'}],
                layout: {
                    type: 'fit',
                    padding: 5
                },
                items: [pelaporanHetList]
            }).show();

            proxy.url = proxy.url+'/'+obat.id;
            pelaporanHetList.getStore().load();
        };
    }
});