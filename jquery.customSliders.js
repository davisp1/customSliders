(function($) {
   $.customSliders = function(element,options) {

        var defaults = {
          "delayIncrement" : 90,
          "duration" : 200,
          "difference" : 100,
          "showPast" : true,
          "counter" : null,
        };

        var plugin = this;
        var oElement = element;
        var $oSlides = null;
        var $current_set = [];
        var $new_set = [];

        var current = null;
        var leftToRight = true;
        var position = "-=";
        var new_position = null;

        var alreadyBusy = false;
        var changed = false;

        var page = 0;
        plugin.options = {};

        plugin.init = function() {
            plugin.options = $.extend({}, defaults, options);
            $oSlides = $(oElement).children("div");
            $oSlides.css("opacity",1);
            plugin.updateSettings();
            current = plugin.options.counter;
            bindEvents();
            manageButtons(null,true);
            $(element).customSliders.refactor();
            //console.log(counter);
        };

        plugin.updateSettings = function() {
            var tmp_nb = 0;
            if(plugin.options.counter === null)
            {
                for(var i=0; i<$oSlides.length;i++)
                    if($oSlides.eq(i).position().top == 0)
                        tmp_nb++;
                plugin.options.counter = tmp_nb;
            }
            $new_set = $oSlides.slice(0,plugin.options.counter).addClass("active");
        };

        var bindEvents = function() {
            $(".prev_slide").click(function(event){
                if(alreadyBusy === false)
                { alreadyBusy = true;
                  changed = ( leftToRight !== false );
                  leftToRight = false;
                  page -= 1;
                  loadNewSlide();
                }
            });

            $(".next_slide").click(function(event){
                if(alreadyBusy===false)
                {
                  alreadyBusy = true;
                  changed = ( leftToRight !== true );
                  leftToRight = true;
                  page += 1;
                  loadNewSlide();
                }
            });
        };
        $.fn.customSliders.refactor = function() {
            var test = [];
            var main_width = $(oElement).width();
            $oSlides.each(function( index ) {
                var myposition = $(this).position();
                var left = Math.round(((myposition.left*100)/main_width)*1000)/1000 ;
                var top = 105
                if($(this).hasClass("active"))
                    top = 0;
                test[index] = { left : left+"%", top : top+"%" };
            });
            $oSlides.each(function( index ) {
                var top = test[index].top;
                var left = test[index].left;
                $(this).css("position","absolute").css("left",left).css("top",top);
            });
            //console.log(test);
        };
        var setNewSlide = function() {
            var new_idx=0;

            $current_set  = $new_set;
            $new_set = [];
            if(leftToRight===true) {
                if(changed==true)
                    current = current + plugin.options.counter ;
                new_idx = current + plugin.options.counter ;
                position = "-=";
                $new_set = $oSlides.slice(current, new_idx);
            }
            else{
                if(changed==true)
                    current = current - plugin.options.counter ;
                new_idx = current - plugin.options.counter ;
                if ( new_idx < 0 ) { new_idx =0; }
                position = "+=";
                $new_set = $oSlides.slice(new_idx, current);
            }
            //console.log("current="+current+",new="+new_idx);
            current = new_idx;
        };
        var loadNewSlide = function() {
                setNewSlide();
                manageButtons($new_set);
                //console.log($($current_set[0]).text());
                //console.log($($new_set[0]).text());
                new_position = position+"105%";
                var delay=0;
                for (var i = 0; i < plugin.options.counter; i++) {
                    if ( plugin.options.showPast === true) {
                        $($current_set[i]).delay(delay).animate({top: new_position, opacity:0.4},plugin.options.duration);
                    } else {
                        $($current_set[i]).css("top",new_position).css("opacity",0.4);
                    }
                    $($new_set[i]).delay(delay+plugin.options.difference).animate({top: new_position, opacity:1},plugin.options.duration);
                    delay += plugin.options.delayIncrement;
                }
                setTimeout(function(){alreadyBusy=false;}, delay+plugin.options.duration);
                $($current_set).removeClass("active");
                $($new_set).addClass("active");
        };

        var manageButtons = function($new_set,isbegin) {
              //console.log(page);
              if($oSlides.length <= plugin.options.counter) {
                    setVisibility("hidden","hidden");
                }
              if((page === 0) || (typeof isbegin !== "undefined" && isbegin === true)) {
                    setVisibility("hidden","visible");
                }
              else if($new_set.length < plugin.options.counter && leftToRight===true) {
                    setVisibility("visible","hidden");
                } 
              else {
                    setVisibility("visible","visible");
                }
      };
      var setVisibility = function(previous,next){
              $(".prev_slide").css("visibility", previous);
              $(".next_slide").css("visibility", next);
      };
        plugin.init();
    };

      // On ajoute le plugin à l'objet jQuery $.fn
    $.fn.customSliders = function(options) {

        // Pour chacuns des élément du dom à qui on a assigné le plugin
        return this.each(function() {

            // Si le plugin n'as pas deja été assigné à l'élément
            if (undefined === $(this).data('customSliders')) {

                // On crée une instance du plugin avec les options renseignées
                var plugin = new $.customSliders(this, options);
                // on stocke une référence de notre plugin
                // pour pouvoir accéder à ses méthode publiques
                // (non utilisé dans ce plugin)
                $(this).data('customSliders', plugin);

            }

        });
    };
})(jQuery);