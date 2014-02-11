Ext.ns('HetApp');

Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'HET',

    appFolder: 'app',

    controllers: [
        'Het'
    ],

    launch: function() {
        Ext.create('Ext.container.Viewport', {
            id: 'app-viewport',
            layout: {
                type: 'border',
                padding: '0 5 5 5' // pad the layout from the wLapordow edges
            },
            items: [
                {
                    id: 'app-header',
                    xtype: 'box',
                    region: 'north',
                    height: 40,
                    html: 'Aplikasi Monitoring HET'
                },
                {
                    xtype: 'panel',
                    id: 'app-options',
                    title: 'Daftar Modul',
                    region: 'west',
                    animCollapse: true,
                    width: 200,
                    minWidth: 150,
                    maxWidth: 400,
                    split: true,
                    collapsible: true,
                    iconCls: 'icon-folder',
                    border: false,
                    layout:{
                        type: 'fit',
                        animate: true
                    },
                    items: [{
                        xtype: 'menu',
                        plain: true,
                        floating: false,
                        minWidth: 180,
                        border: false,
                        allowOtherMenus: true,
                        activeItem: 0,
                        items: [{
                            id: 'btnMenuPelaport',
                            text: 'Pelaporan Het'
                        }, {
                            text: 'Daftar Obat'
                        }, {
                            text: 'Daftar Sarana Pelayanan'
                        }, {
                            text: 'Daftar Sarana Pelayanan'
                        },  {
                            text: 'Log SMS'
                        }]
                    }]
                },
                {
                    xtype: 'hetlist',
                    id: 'gridhet',
                    region: 'center'
                }
            ]
        });

        Ext.getBody().on('click', function(event, target){
            event.preventDefault();
            var id = target.getAttribute('data-id-obat')
            ,   obat = Ext.getCmp('gridhet').getStore().findRecord('id', id).data;

            HetApp.renderWLapor(obat);
        }, null, {delegate: '.wlapor'});

        HetApp.renderWLapor = function(obat) {
            var pelaporanHetList = Ext.create('widget.pelaporanHetList')
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
                minWidth: 350,
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