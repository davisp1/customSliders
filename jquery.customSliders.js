(function($) {
   $.customSliders = function(element,options) {
    
    // Default options that you can override in passing options as parameter
        var defaults = {
          "delayIncrement" : 90,
          "duration" : 200,
          "difference" : 100,
          "showPast" : true,
          "counter" : null,
          "vertical" : true,
          "autodesign" : true,
          // native API allows just "swing" and "linear" easing
          "easing" : "swing"
        };

    // to help, we put "this" as a plugin variable
        var plugin = this;
    // Jquery object of the container
        var oElement = element;
    // Array containing slides as Jquery object
        var $oSlides = null;
    // Array of current slides
        var $current_set = [];
    // Array of next slides
        var $new_set = [];
    // Array with all left positions from active blocs
        var left_positions = [];
    // current position
        var current = null;
    // previous/next
        var leftToRight = true;

    // part of new_position variable
        var position = "-=";
    // variable that we use to increment css attribute
        var new_position = null;

    // flag to block loading new slides ( because it was alreading in loading )
        var alreadyBusy = false;
    // flag that is true when we change sens
        var changed = false;

    // if counter is set as a parameter or it uses default parameter
        var isCounterSet = false;
    // current page number
        var page = 0;
        var totalpage = 0;
        plugin.options = {};

    /** 
    * Initialisation function
    **/
        plugin.init = function() {
            plugin.options = $.extend({}, defaults, options);
            $oSlides = $(oElement).children("div");
            $oSlides.css("opacity",1);
            updateSettings();
            bindEvents();
            manageButtons(null,true);
        };

    /**
    * public functions
    **/
        $.fn.customSliders.refactor = function(){ refactor () };
        $.fn.customSliders.updateSettings = function(params){ updateSettings (params) };

    /**
    * function that updates settings and next refactor sliders  
    * - params : all arguments that you can put in options
    **/
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
            $new_set = $oSlides.slice(0,new_counter).addClass("active").css("opacity",1);

            totalpage=Math.ceil($oSlides.length/new_counter);
            current = new_counter;
            page = 0;
            leftToRight = true;

            refactor();          
        };
    
    /**
    * Bind onClick event on previous/next buttons 
    **/
        var bindEvents = function() {
            $(".prev_slide").click(function(event){
                if(alreadyBusy === false) { 
          alreadyBusy = true;
                  changed = ( leftToRight !== false );
                  leftToRight = false;
                  page -= 1;
                  loadNewSlide();
                }
            });

            $(".next_slide").click(function(event){
                if(alreadyBusy===false) {
                  alreadyBusy = true;
                  changed = ( leftToRight !== true );
                  leftToRight = true;
                  page += 1;
                  loadNewSlide();
                }
            });
        };

    /**
    * Refactor slider to tranform structure in using position absolute
    **/
        var refactor = function() {
            var test = [];
            var pallier = 100/plugin.options.counter
            var main_width = $(oElement).width();
            var tmp_counter = 0;
            var flagi = 0;
            left_positions = [];
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
                    }
                }
                else if(flagi>0)
                {
                    top = 105;
                }
                if(isCounterSet===true || plugin.options.autodesign==true)
                {
                    var left = parseFloat(tmp_counter*pallier);
                }
                else
                    var left = Math.round(((myposition.left*100)/main_width)*1000)/1000 ;

                if (plugin.options.vertical === false)
                {
                    var left = left - top;
                    var top = 0;
                }

                if($(this).hasClass("active"))
                {
                    left_positions.push(left);
                }

                test[index] = { left : left+"%", top : top+"%" };

                if(tmp_counter<plugin.options.counter-1)
                    tmp_counter+=1;
                else
                    tmp_counter=0;

            });
            //console.log(left_positions);
            $oSlides.each(function( index ) {
                var top = test[index].top;
                var left = test[index].left;
                $(this).css("position","absolute").css("left",left).css("top",top);
                if(isCounterSet == true) {
                    $(this).css("width",(pallier-0.3)+"%");
                }
            });
        };

    /**
    * Function that prepares new slide
    **/ 
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

    /**
    * Function that loads new slide
    **/
        var loadNewSlide = function() {
                setNewSlide();
                manageButtons($new_set);
                var increment = 105;
                new_position = (position+105+"%").replace("=","");
                var delay=0;
                for (var i = 0; i < plugin.options.counter; i++) {
                    if( plugin.options.vertical ===true)
                    {
                    if ( plugin.options.showPast === true) {
                        $($current_set[i]).delay(delay).animate({top: new_position, opacity:0.4},plugin.options.duration,plugin.options.easing);
                    } else {
                        $($current_set[i]).css("top",new_position).css("opacity",0.4);
                    }
                        $($new_set[i]).delay(delay+plugin.options.difference).animate({top: "0%", opacity:1},plugin.options.duration,plugin.options.easing);
                    }
                    else{
                        left = left_positions[i];
                        if(position=="+=")
                            newleft = left - increment;
                        else
                            newleft = left + increment;
                        //console.log("before : "+left+" after : "+newleft);
                        if ( plugin.options.showPast === true) {  
                            $($current_set[i]).delay(delay).animate({left: newleft+"%", opacity:0.4},plugin.options.duration,plugin.options.easing);
                        } else {
                            $($current_set[i]).css("left",newleft).css("opacity",0.4);
                        }
                        $($new_set[i]).delay(delay+plugin.options.difference).animate({left: left+"%", opacity:1},plugin.options.duration,plugin.options.easing);               
                    }
                    delay += plugin.options.delayIncrement;
                }
                setTimeout(function(){alreadyBusy=false;/**console.log(delay+200+plugin.options.duration);**/}, delay+200+plugin.options.duration);
                $($current_set).removeClass("active");
                $($new_set).addClass("active");
        };

    /**
    * Function that manage previous/next button visibility
    **/
        var manageButtons = function($new_set,isbegin) {
              if($oSlides.length <= plugin.options.counter) {
                    setVisibility("hidden","hidden");
                }
              else if(page === 0){
                    setVisibility("hidden","visible");
                }
              else if(page === (totalpage-1)) {
                    setVisibility("visible","hidden");
                } 
              else {
                    setVisibility("visible","visible");
                }
      };

      /** 
      * Function that set previous/next button visibility
      * - previous : visibility attribute of previous button
      * - next : visibility attribute of next button
      **/
      var setVisibility = function(previous,next){
              $(".prev_slide").css("visibility", previous);
              $(".next_slide").css("visibility", next);
      };
        plugin.init();
    };

    // Add plugin on jQuery Object $.fn
    $.fn.customSliders = function(options) {

        // For each element from DOM that we assign the plugin
        return this.each(function() {

            // If element hasn't still assigned to the plugin
            if (undefined === $(this).data('customSliders')) {

                // We create instance of customSliders plugin with options in parameter
                var plugin = new $.customSliders(this, options);
                // we stock reference from the plugin
                // in order to get its public functions
                $(this).data('customSliders', plugin);

            }

        });
    };
})(jQuery);