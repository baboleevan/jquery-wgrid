/**
jQuery Wgrid Plugin.
 @ author	: changwan jun
 @ mail		: me@wani.kr
 @ website	: http://wani.kr
**/

;(function($){

	var
	default_settings = {
		'item_width' : 'auto'
	},
	// column for clone :)
	$column = $( '<div>' ).css({'float' : 'left'}).addClass('bricks-column'),
	// resize action checker!!
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
		this.container_width = 0;

		this.items = [];
		this.item_width = 0;
		this.item_column = 0;

		this.__construct();
	};

	$.Wgrid.prototype = {
		__construct : function() {

			var $container		= $( this.container ); 
			var container_width	= $container.innerWidth();

			var items = this.items;
			$container.find('> *').each(function() {
				items.push( this );
			});

			var item_width = 0;
			if ( this.settings.item_width == 'auto' ) {
				var w = 0;
				for (var idx in items) { w = Math.max( $( items[idx] ).outerWidth(true), w ); }
				item_width = w;
			}
			else {
				item_width = this.settings.item_width;
			}

			var item_column		= Math.max(1, parseInt(container_width / item_width));

			this.container_width = container_width;

			this.items = items;
			this.item_width = item_width;
			this.item_column = item_column;

			// init!
			for (var i = 0; i < item_column; i++ ) {
				var $div = $column.clone().css({'width' : item_width});
				$div[0].id = 'bricks-column-' + i;
				$container.append( $div );
			}

			resize_hook.push( this );
			this.fetch( 0 );
		},
		__restruct : function( elements ) {
			var items_len_before = this.items.length;
			var items = this.items;
			if ( elements == null ) {
				$(this.container).find( '> *:not( .bricks-column )' ).each(function() {
					items.push( this );
				});
			}
			else {
				$( elements ).each(function() {
					items.push( this );
				});
			}
			this.items = items;

			this.fetch( items_len_before );
		},
		resize : function() {

			var is_resize = false;

			var $container		= $( this.container ); 
			var container_width	= $container.innerWidth();

			var items = this.items;

			var item_width = 0;
			if ( this.settings.item_width == 'auto' ) {
				var w = 0;
				for (var idx in items) { w = Math.max( $( items[idx] ).outerWidth(true), w ); }
				item_width = w;
			}
			else {
				item_width = this.settings.item_width;
			}

			var item_column		= Math.max(1, parseInt(container_width / item_width));

			if ( this.container_width != container_width ) {
				this.container_width = container_width;
				is_resize = true;
			}
			if ( this.item_width != item_width ) {
				this.item_width = item_width;
				is_resize = true;
			}

			var item_column_before = this.item_column;
			if ( this.item_column != item_column ) {
				this.item_column = item_column;
				is_resize = true;
			}

			if (is_resize) {
				if ( item_column !== item_column_before ) {
					if ( item_column_before > item_column ) {
						for (var i = item_column; i < item_column_before; i++ ) {
							$( '#bricks-column-' + i ).hide();
						}
					}
					else {
						for (var i = item_column_before; i < item_column; i++ ) {
							if ( $( '#bricks-column-' + i ).length == 0 ) {
								var $div = $column.clone();
								$div[0].id = 'bricks-column-' + i;
								$container.append( $div );
							}
							else {
								$( '#bricks-column-' + i ).show();
							}
						}
					}
				}
				if ( item_column != 1 ) {
					$( 'div.bricks-column' ).css({'width' : item_width});
				}
				else {
					$( 'div.bricks-column' ).css({'width' : 'auto'});
				}
				this.fetch( 0 );
			}
			
		},
		fetch : function( n ) {
			var item_height = [];
			for (var i = 0; i < this.item_column; i++) {
				item_height[i] = 0;
				if ( n > 0 ) {
					$( '#bricks-column-' + i ).find("> *").each(function() {
						item_height[i] += $(this).outerHeight( true );
					});
				}
			}
			for (var i = n; i < this.items.length; i++) {
				var idx = item_height.indexOf(Math.min.apply(Math, item_height));
				$( '#bricks-column-' + idx ).append( this.items[i] );				
				item_height[idx] += $( this.items[i] ).outerHeight( true );
			}
		}
	};

$.fn.wgrid = function( opt, val ) {
	this.each(function() {
		var ins = $.data( this, 'bricks' );
		if ( typeof ins == 'undefined' ) {
			ins = new $.Wgrid( opt, this );
			$.data( this, 'bricks', ins );
		}
		else {
			if (opt == "append") { ins.__restruct( val ); }
			else { ins.__restruct( null ); }
		}
	});
	return this;
};


// end of script
})(jQuery);