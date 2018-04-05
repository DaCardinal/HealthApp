$(function()
{
    var targets = $('[rel~=static-sidebar-nav-tooltip]'),
        target  = false,
        tooltip = false,
		targetWidth = false,
        tTitle   = false;
     
    var toolTipBehaviour = function () {
        target  = $(this);
        tTitle     = target.attr('data-title');
        tooltip = $('<div class="static-sidebar-nav-tooltip"></div>');
		targetWidth = $('.static-sidebar-nav ul').width();

        if( !tTitle || tTitle === '')
            return false;

        target.removeAttr('title');

        if($("#wrapper").hasClass("toggled") || $("#wrapper").hasClass("collapsed-toggle")){
          tooltip.css('margin-left', '-87px');
        }

        tooltip.css('opacity', 0)
               .html(tTitle)
               .appendTo('body');

        var init_tooltip = function(){
            if($(window).width() < tooltip.outerWidth() * 1.5 ){
                tooltip.css('max-width', $(window).width() / 2);
            }else{
                tooltip.css('max-width', 340);
            }
         		if($(window).width() < 767){
              var pos_left = target.offset().left + targetWidth - 50;
        		}else{
        			var pos_left = target.offset().left + targetWidth - 50;
        		}

            var pos_top  = target.offset().top + 6;
            tooltip.css( { left: pos_left, top: pos_top }).animate( {opacity: 1 }, 50 );
        };

        init_tooltip();
        $(window).resize(init_tooltip);

        var remove_tooltip = function(){
            tooltip.animate( { top: '-=10', opacity: 0 }, 50, function() {
                $(this).remove();
            });

            target.attr( 'title', tTitle );
        };

        target.bind('mouseleave', remove_tooltip);
        tooltip.bind('click', remove_tooltip);

		target.click(function(){
			remove_tooltip();
		});
    }

 	targets.bind( 'mouseenter', toolTipBehaviour);
});
