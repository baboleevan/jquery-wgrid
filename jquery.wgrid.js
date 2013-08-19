/**
jQuery Wgrid Plugin.
 @ author	: changwan jun
 @ mail		: me@wani.kr
 @ website	: http://wani.kr
**/

;(function($){

	var
	default_settings = {
		'width' : 'auto'
	},
	$column = null,
	resize_hook = []
	;

	var _resizeHandler = function() {
		for( var idx in resize_hook ) {
			resize_hook[idx].resize();
		}
	};

	$(window).bind("resize", _resizeHandler);

	//class
	$.Wgrid = function( opt, container ) {

		this.settings = $.extend(default_settings, opt);
		this.container = container;
		this.items = [];
		this.container_width = 0;
		this.item_column = 0;
		this.__construct();

	};

	$.Wgrid.prototype = {
		__construct : function() {
			var items = this.items;
			$( this.container ).find('> *').each(function() {
				items.push( this );
			});
			if ( this.settings.width == 'auto' ) {
				var w = 0;
				for (var idx in this.items) {
					w = Math.max( $( this.items[idx] ).outerWidth(true), w );
				}
				this.settings.width = w;
			}
			$column = $( '<div>' ).css({'float' : 'left','width' : this.settings.width}).addClass('bricks-column');

			resize_hook.push( this );
		},
		__restruct : function() {
			var items = this.items;
			$(this.container).find( '> *:not( .bricks-column )' ).each(function() {
				items.push( this );
			});
		},
		init : function() {
			this.resize();
		},
		resize : function() {
			var $container = $( this.container ); 
			if ( this.container_width != $container.innerWidth() ) {
				this.container_width = $container.innerWidth();
				if ( this.item_column != Math.max(1, parseInt(this.container_width / this.settings.width)) ) {
					var column = Math.max(1, parseInt(this.container_width / this.settings.width));
					if ( this.item_column > column ) {
						for (var i = column; i < this.item_column; i++ ) {
							$( '#bricks-column-' + i ).remove();
						}
					}
					else {
						for (var i = this.item_column; i < column; i++ ) {
							var $div = $column.clone();
							$div[0].id = 'bricks-column-' + i;
							$container.append( $div );
						}
					}
					this.item_column = column;
					this.fetch();
				}
			}
		},
		fetch : function() {
			var item_height = [];
			for (var i = 0; i < this.item_column; i++) { item_height[i] = 0; }
			for (var i = 0; i < this.items.length; i++) {
				var idx = item_height.indexOf(Math.min.apply(Math, item_height));
				item_height[idx] += $( this.items[i] ).outerHeight( true );
				$( '#bricks-column-' + idx ).append( this.items[i] );
			}
		}
	};

$.fn.wgrid = function( opt ) {
	this.each(function() {
		var ins = $.data( this, 'bricks' );
		if ( typeof ins == 'undefined' ) {
			ins = new $.Wgrid( opt, this );
			$.data( this, 'bricks', ins );
			ins.init();
		}
		else {
			ins.__restruct();
			ins.fetch();
		}
	});
	return this;
};


// end of script
})(jQuery);