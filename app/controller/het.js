Ext.define('HET.controller.Het', {
    extend: 'Ext.app.Controller',

    views: [
        'het.List',
        'pelaporan_het.List'
    ],

    init: function() {
        this.control({
            '#gridhet': {
                afterrender: function() {
                }
            }
        });
		// this.listen({
  //           component: {
  //               '#gridhet a.wlapor': {
  //                   click: this.showPelaporanWindow
  //               }
  //           }
  //       });
    },

    showPelaporanWindow: function() {
    	alert('sadasds');
    },

    onPanelRendered: function() {
        console.log('The panel was rendered');
    }
});