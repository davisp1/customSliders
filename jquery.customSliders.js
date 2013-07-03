(function($) {
   $.customSliders = function(element,options) {

        var defaults = {
          "delayIncrement" : 90,
          "duration" : 200,
          "difference" : 100,
          "showPast" : true,
          "counter" : null,
          "autodesign" : true
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

        var isCounterSet = false;
        var page = 0;
        plugin.options = {};

        plugin.init = function() {
            plugin.options = $.extend({}, defaults, options);
            $oSlides = $(oElement).children("div");
            $oSlides.css("opacity",1);
            updateSettings();
            current = plugin.options.counter;
            bindEvents();
            manageButtons(null,true);
            refactor();
        };

        $.fn.customSliders.refactor = function(){ refactor () };
        $.fn.customSliders.updateSettings = function(params){ updateSettings (params) };

        var updateSettings = function(params) {
            var old_counter = plugin.options.counter;
            plugin.options = $.extend({}, plugin.options, params);
            var new_counter = plugin.options.counter;
            var tmp_nb = 0;
            if(plugin.options.counter === null)
            {
                for(var i=0; i<$oSlides.length;i++)
                    if($oSlides.eq(i).position().top == 0)
                        tmp_nb++;
                plugin.options.counter = tmp_nb;
                old_counter = plugin.options.counter;
                new_counter = plugin.options.counter;
            }
            else{
                isCounterSet = true;
            }
            $oSlides.removeClass("active");
            begin_index = page*old_counter;
            //current = begin_index+new_counter;
            /**
            $new_set = $oSlides.slice(begin_index,begin_index+new_counter).addClass("active").css("opacity",1);
            console.log($new_set);
            if(old_counter!=new_counter) {
                isCounterSet = true;
                page = Math.ceil(begin_index/new_counter);
                console.log(begin_index/new_counter);
                refactor();
            **/
            current = new_counter;
            $new_set = $oSlides.slice(0,new_counter).addClass("active").css("opacity",1);
            if(old_counter!=new_counter) {
                isCounterSet = true;
                page = 0
                refactor();          
            }
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
        var refactor = function() {
            var test = [];
            var pallier = 100/plugin.options.counter
            //console.log(pallier)
            //console.log(page);
            var main_width = $(oElement).width();
            var tmp_counter = 0;
            var flagi = 0;
            $oSlides.each(function( index ) {
                var myposition = $(this).position(); 
                var top = -105;
                if($(this).hasClass("active"))
                {
                    flagi = flagi + 1;
                    top = 0;
                    if(flagi===1)
                    {
                        tmp_counter=0;
                        //console.log("changed "+tmp_counter);
                    }
                }
                else if(flagi>0)
                {
                    top = 105;
                }
                if(isCounterSet===true || plugin.options.autodesign==true)
                    {
                        var left = parseFloat(tmp_counter*pallier);
                        //console.log("in case" + left);                
                    }
                else
                    var left = Math.round(((myposition.left*100)/main_width)*1000)/1000 ;
                test[index] = { left : left+"%", top : top+"%" };
                //console.log(test[index]);
                if(tmp_counter<plugin.options.counter-1)
                    tmp_counter+=1;
                else
                    tmp_counter=0;
                //console.log("tmp "+tmp_counter);

            });
            $oSlides.each(function( index ) {
                var top = test[index].top;
                var left = test[index].left;
                $(this).css("position","absolute").css("left",left).css("top",top);
                if(isCounterSet == true) {
                    //console.log(pallier-0.3);
                    $(this).css("width",(pallier-0.3)+"%");
                }
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
                //console.log("page t=>" + page);
                //console.log($($current_set[0]).text());
                //console.log($($new_set[0]).text());
                new_position = (position+"105%").replace("=","");
                var delay=0;
                for (var i = 0; i < plugin.options.counter; i++) {
                    if ( plugin.options.showPast === true) {
                        $($current_set[i]).delay(delay).animate({top: new_position, opacity:0.4},plugin.options.duration);
                    } else {
                        $($current_set[i]).css("top",new_position).css("opacity",0.4);
                    }
                    $($new_set[i]).delay(delay+plugin.options.difference).animate({top: "0%", opacity:1},plugin.options.duration);
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