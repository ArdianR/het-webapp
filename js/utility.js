/**
 * Search plugin for Ext.grid.GridPanel, Ext.grid.EditorGrid ver. 2.x or subclasses of them
 *
 * @author    Ing. Jozef Sakalos
 * @copyright (c) 2008, by Ing. Jozef Sakalos
 * @date      17. January 2008
 * @version   $Id: Ext.ux.grid.Search.js 220 2008-04-29 21:46:51Z jozo $
 *
 * @license Ext.ux.grid.Search is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

/*
	Revised for Ext 4
	by Nathan LeBlanc
	on July 8, 2011
*/

Ext.define('Ext.ux.grid.feature.Searching', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.searching',

	/**
	 * cfg {Boolean} autoFocus true to try to focus the input field on each store load (defaults to undefined)
	 */

	/**
	 * @cfg {String} searchText Text to display on menu button
	 */
	searchText:'Search',

	/**
	 * @cfg {String} searchTipText Text to display as input tooltip. Set to '' for no tooltip
	 */
	searchTipText:'Type a text to search and press Enter',

	/**
	 * @cfg {String} selectAllText Text to display on menu item that selects all fields
	 */
	selectAllText:'Select All',

	/**
	 * @cfg {String} position Where to display the search controls. Valid values are top and bottom (defaults to bottom)
	 * Corresponding toolbar has to exist at least with mimimum configuration tbar:[] for position:top or bbar:[]
	 * for position bottom. Plugin does NOT create any toolbar.
	 */
	position:'top',

	/**
	 * @cfg {String} iconCls Icon class for menu button (defaults to icon-magnifier)
	 */
	iconCls:'icon-magnifier',

	/**
	 * @cfg {String/Array} checkIndexes Which indexes to check by default. Can be either 'all' for all indexes
	 * or array of dataIndex names, e.g. ['persFirstName', 'persLastName']
	 */
	checkIndexes:'all',

	/**
	 * @cfg {Array} disableIndexes Array of index names to disable (not show in the menu), e.g. ['persTitle', 'persTitle2']
	 */
	disableIndexes:[],

	/**
	 * @cfg {String} dateFormat how to format date values. If undefined (the default)
	 * date is formatted as configured in colummn model
	 */
	dateFormat:undefined,

	/**
	 * @cfg {Boolean} showSelectAll Select All item is shown in menu if true (defaults to true)
	 */
	showSelectAll:true,

	/**
	 * @cfg {String} menuStyle Valid values are 'checkbox' and 'radio'. If menuStyle is radio
	 * then only one field can be searched at a time and selectAll is automatically switched off.
	 */
	menuStyle:'checkbox',

	/**
	 * @cfg {Number} minChars minimum characters to type before the request is made. If undefined (the default)
	 * the trigger field shows magnifier icon and you need to click it or press enter for search to start. If it
	 * is defined and greater than 0 then maginfier is not shown and search starts after minChars are typed.
	 */

	/**
	 * @cfg {String} minCharsTipText Tooltip to display if minChars is > 0
	 */
	minCharsTipText:'Type at least {0} characters',

	/**
	 * @cfg {String} mode Use 'remote' for remote stores or 'local' for local stores. If mode is local
	 * no data requests are sent to server the grid's store is filtered instead (defaults to 'remote')
	 */
	mode:'remote',

	/**
	 * @cfg {Array} readonlyIndexes Array of index names to disable (show in menu disabled), e.g. ['persTitle', 'persTitle2']
	 */

	/**
	 * @cfg {Number} width Width of input field in pixels (defaults to 100)
	 */
	width:100,

	/**
	 * @cfg {Object} paramNames Params name map (defaults to {fields:'fields', query:'query'}
	 */
	paramNames: {
		 fields:'fields'
		,query:'query'
	},

	/**
	 * @cfg {String} shortcutKey Key to fucus the input field (defaults to r = Sea_r_ch). Empty string disables shortcut
	 */
	shortcutKey:'r',

	/**
	 * @cfg {String} shortcutModifier Modifier for shortcutKey. Valid values: alt, ctrl, shift (defaults to alt)
	 */
	shortcutModifier:'alt',

	/**
	 * @cfg {String} align 'left' or 'right' (defaults to 'left')
	 */

	/**
	 * @cfg {Number} minLength force user to type this many character before he can make a search
	 */

	/**
	 * @cfg {Ext.Panel/String} toolbarContainer Panel (or id of the panel) which contains toolbar we want to render
	 * search controls to (defaults to this.grid, the grid this plugin is plugged-in into)
	 */

	init: function(grid) {
        this.grid = grid;
        if(this.grid.rendered)
            this.onRender();
        else
            this.grid.on('render', this.onRender, this);
    },

	onRender:function() {

		var panel = this.toolbarContainer || this.grid;
		var tb = 'bottom' === this.position ? panel.getDockedItems('toolbar[dock="bottom"]') : panel.getDockedItems('toolbar[dock="top"]');
		if(tb.length > 0)
			tb = tb[0]
		else {
			tb = Ext.create('Ext.toolbar.Toolbar', {dock: this.position});
			panel.addDocked(tb);
		}

		// add menu
		this.menu = Ext.create('Ext.menu.Menu');

		// handle position
		if('right' === this.align) {
			tb.add('->');
		}
		else {
			if(0 < tb.items.getCount()) {
				tb.add('-');
			}
		}

		// add menu button
		tb.add({
			 text:this.searchText
			,menu:this.menu
			,iconCls:this.iconCls
		});

		// add input field (TwinTriggerField in fact)
		this.field = Ext.create('Ext.form.TwinTriggerField', {
			width:this.width,
			qtip: 'ddd',
			selectOnFocus:undefined === this.selectOnFocus ? true : this.selectOnFocus,
			trigger1Cls:'x-form-clear-trigger',
			trigger2Cls:this.minChars ? 'x-hidden' : 'x-form-search-trigger',
			onTrigger1Click: Ext.bind(this.onTriggerClear, this),
			onTrigger2Click: this.minChars ? Ext.emptyFn : Ext.bind(this.onTriggerSearch, this),
			minLength:this.minLength
		});

		// install event handlers on input field
		this.field.on('render', function() {

			var qtip = this.minChars ? Ext.String.format(this.minCharsTipText, this.minChars) : this.searchTipText;
			Ext.QuickTips.register({
				target: this.field.inputEl,
				text: qtip
			});

			if(this.minChars) {
				this.field.el.on({scope:this, buffer:300, keyup:this.onKeyUp});
			}

			// install key map
			var map = new Ext.KeyMap(this.field.el, [{
				 key:Ext.EventObject.ENTER
				,scope:this
				,fn:this.onTriggerSearch
			},{
				 key:Ext.EventObject.ESC
				,scope:this
				,fn:this.onTriggerClear
			}]);
			map.stopEvent = true;
		}, this, {single:true});

		tb.add(this.field);

		// reconfigure
		this.reconfigure();

		// keyMap
		if(this.shortcutKey && this.shortcutModifier) {
			var shortcutEl = this.grid.getEl();
			var shortcutCfg = [{
				 key:this.shortcutKey
				,scope:this
				,stopEvent:true
				,fn:function() {
					this.field.focus();
				}
			}];
			shortcutCfg[0][this.shortcutModifier] = true;
			this.keymap = new Ext.KeyMap(shortcutEl, shortcutCfg);
		}

		if(true === this.autoFocus) {
			this.grid.store.on({scope:this, load:function(){this.field.focus();}});
		}
	} // eo function onRender
	// }}}
	// {{{
	/**
	 * field el keypup event handler. Triggers the search
	 * @private
	 */
	,onKeyUp:function() {
		var length = this.field.getValue().toString().length;
		if(0 === length || this.minChars <= length) {
			this.onTriggerSearch();
		}
	} // eo function onKeyUp
	// }}}
	// {{{
	/**
	 * private Clear Trigger click handler
	 */
	,onTriggerClear:function() {
		if(this.field.getValue()) {
			this.field.setValue('');
			this.field.focus();
			this.onTriggerSearch();
		}
	} // eo function onTriggerClear
	// }}}
	// {{{
	/**
	 * private Search Trigger click handler (executes the search, local or remote)
	 */
	,onTriggerSearch:function() {
		if(!this.field.isValid()) {
			return;
		}
		var val = this.field.getValue(),
			store = this.grid.store,
			proxy = store.getProxy();

		// grid's store filter
		if('local' === this.mode) {
			store.clearFilter();
			if(val) {
				store.filterBy(function(r) {
					var retval = false;
					this.menu.items.each(function(item) {
						if(!item.checked || retval) {
							return;
						}
						var rv = r.get(item.dataIndex);
						rv = rv instanceof Date ? Ext.Date.format(rv, this.dateFormat || r.fields.get(item.dataIndex).dateFormat) : rv;
						var re = new RegExp(val, 'gi');
						retval = re.test(rv);
					}, this);
					if(retval) {
						return true;
					}
					return retval;
				}, this);
			}
		}
		// ask server to filter records
		// your proxy must be a Server proxy
		else if(proxy instanceof Ext.data.proxy.Server) {
			// clear start (necessary if we have paging)
			if(store.lastOptions && store.lastOptions.params) {
				store.lastOptions.params[store.paramNames.start] = 0;
			}

			// get fields to search array
			var fields = [];
			this.menu.items.each(function(item) {
				if(item.checked && item.dataIndex) {
					fields.push(item.dataIndex);
				}
			});

			// add fields and query to baseParams of store
			delete(proxy.extraParams[this.paramNames.fields]);
			delete(proxy.extraParams[this.paramNames.query]);
			if (store.lastOptions && store.lastOptions.params) {
				delete(proxy.lastOptions.params[this.paramNames.fields]);
				delete(proxy.lastOptions.params[this.paramNames.query]);
			}
			if(fields.length) {
				proxy.extraParams[this.paramNames.fields] = Ext.encode(fields);
				proxy.extraParams[this.paramNames.query] = val;
			}

			// reload store
			store.load();
		}

	} // eo function onTriggerSearch
	// }}}
	// {{{
	/**
	 * @param {Boolean} true to disable search (TwinTriggerField), false to enable
	 */
	,setDisabled:function() {
		this.field.setDisabled.apply(this.field, arguments);
	} // eo function setDisabled
	// }}}
	// {{{
	/**
	 * Enable search (TwinTriggerField)
	 */
	,enable:function() {
		this.setDisabled(false);
	} // eo function enable
	// }}}
	// {{{
	/**
	 * Enable search (TwinTriggerField)
	 */
	,disable:function() {
		this.setDisabled(true);
	} // eo function disable
	// }}}
	// {{{
	/**
	 * private (re)configures the plugin, creates menu items from column model
	 */
	,reconfigure:function() {

		// {{{
		// remove old items
		var menu = this.menu;
		menu.removeAll();

		// add Select All item plus separator
		if(this.showSelectAll && 'radio' !== this.menuStyle) {
			menu.add({
				xtype: 'menucheckitem',
				text:this.selectAllText,
				checked:!(this.checkIndexes instanceof Array),
				hideOnClick:false,
				handler:function(item) {
					var checked = item.checked;
					item.parentMenu.items.each(function(i) {
						if(item !== i && i.setChecked && !i.disabled) {
							i.setChecked(checked);
						}
					});
				}
			},'-');
		}

		// }}}
		// {{{
		// add new items
		var columns = this.grid.headerCt.items.items;
		var group = undefined;
		if('radio' === this.menuStyle) {
			group = 'g' + (new Date).getTime();
		}

		Ext.each(columns, function(column) {
			var disable = false;
			if(column.text && column.dataIndex && column.dataIndex != '') {
				Ext.each(this.disableIndexes, function(item) {
					disable = disable ? disable : item === column.dataIndex;
				});
				if(!disable) {
					menu.add({
						xtype: 'menucheckitem',
						text: column.text,
						hideOnClick: false,
						group:group,
						checked: 'all' === this.checkIndexes,
						dataIndex: column.dataIndex,
					});
				}
			}
		}, this);
		// }}}
		// {{{
		// check items
		if(this.checkIndexes instanceof Array) {
			Ext.each(this.checkIndexes, function(di) {
				var item = menu.items.find(function(itm) {
					return itm.dataIndex === di;
				});
				if(item) {
					item.setChecked(true, true);
				}
			}, this);
		}
		// }}}
		// {{{
		// disable items
		if(this.readonlyIndexes instanceof Array) {
			Ext.each(this.readonlyIndexes, function(di) {
				var item = menu.items.find(function(itm) {
					return itm.dataIndex === di;
				});
				if(item) {
					item.disable();
				}
			}, this);
		}
		// }}}

	} // eo function reconfigure
	// }}}
});
Ext.override(Ext.data.Store, {
	listeners: {
		load: function(self, records, successful, eOpts) {
			var message = '';
			if (!successful) {
				if (typeof self.getProxy().reader.rawData === 'undefined')
					message = 'Terjadi kesalahan sistem';
				else
					message = self.getProxy().reader.rawData.message;

				Ext.MessageBox.show({
					title: 'Peringatan',
					msg: message,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			} else {
				message = self.getProxy().reader.rawData.message;
				if (message)
					Ext.example.msg('Informasi', self.getProxy().reader.rawData.message);
			}
		}
	}
});

/** Overrides the native ExtJS setException method. Added responseText to
 *  propogate server-side error messages back to the client.
 */
Ext.data.proxy.Server.override({
	setException: function(operation, response) {
		operation.setException({
			status: response.status,
			statusText: response.statusText,
			responseText: response.responseText //<--Added this line!
		});
	}
});

Ext.example = function(){
    var msgCt;

    function createBox(t, s){
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }
    return {
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.core.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.core.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1000, remove: true});
        }
    };
}();

Ext.ns('Utility');

Utility.messagePopup = function(config) {
	if (config.type == 'error') {
		config.title = 'Peringatan';
		config.icon = Ext.MessageBox.ERROR;
	} else {
		config.title = 'Pesan';
		config.icon = Ext.MessageBox.SUCCESS;
	}
	Ext.MessageBox.show({
		title: config.title,
		msg: config.message,
		buttons: Ext.MessageBox.OK,
		icon: config.icon
	});
};

Utility.month = {
	"01": "Januari",
	"02": "Februari",
	"03": "Maret",
	"04": "April",
	"05": "Mei",
	"06": "Juni",
	"07": "Juli",
	"08": "Agustus",
	"09": "September",
	"10": "Oktober",
	"11": "November",
	"12": "Desember"
};

Utility.dropdownMonth = function() {
	var month = Utility.month
	,	dropdown = [];

	for(var key in month) {
		dropdown.push({
			"bulan": key,
			"name" : month[key]
		});
	}
	return dropdown;
};

Utility.isNormalInteger = function (str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
};

Number.prototype.toMoney = function(decimals, decimal_sep, thousands_sep)
{
   var n = this,
   c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
   d = decimal_sep || ',', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

   /*
   according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
   the fastest way to check for not defined parameter is to use typeof value === 'undefined'
   rather than doing value === undefined.
   */
   t = (typeof thousands_sep === 'undefined') ? '.' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

   sign = (n < 0) ? '-' : '',

   //extracting the absolute value of the integer part of the number and converting to string
   i = parseInt(n = Math.abs(n).toFixed(c), 10) + '',

   j = ((j = i.length) > 3) ? j % 3 : 0;
   return "Rp "+ sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
};