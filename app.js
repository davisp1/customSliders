(function($) {
   $.customSliders = function(element,options) {

        var defaults = {
          "delayIncrement" : 100,
          "duration" : 300,
          "difference" : 10,
          "showPast" : true
        };
        var counter = 5;
        var current = counter;
        var $current_set = [];
        var $new_set = [];
        var height = null;
        var leftToRight = true;
        var position = "-=";
        var plugin = this;
        var flag = false;
        var $oSlides = null;
        var oElement = element;
        var new_position = null;
        var changed = false;
        var page = 0;
        plugin.options = {};

        plugin.init = function() {
            plugin.options = $.extend({}, defaults, options);
            $oSlides = $(oElement).children("div");
            $oSlides.css("opacity",1);
            $new_set = $oSlides.slice(0,counter).addClass("active");
            var $example = $oSlides.first();
            height = parseInt($example.css("border-top-width"),10) + parseInt($example.css("border-bottom-width"),10) + $example.height() + "px";
            new_position = position + height;
            //counter = parseInt($(customSliders.selector).width()/$(customSliders.selector).find("div:first").width(),10);
            bindEvents();
            manageButtons(null,true);
        };

        plugin.update = function() {
            console.log("sfksdlfkslf");
        };

        var bindEvents = function() {
            $(".prev_slide").click(function(event){
                if(flag === false)
                { flag = true;
                  changed = ( leftToRight !== false );
                  leftToRight = false;
                  page -= 1;
                  loadNewSlide();
                }
            });

            $(".next_slide").click(function(event){
                console.log(flag);
                if(flag===false)
                {
                  flag = true;
                  changed = ( leftToRight !== true );
                  leftToRight = true;
                  page += 1;
                  loadNewSlide();
                }
            });
        };
        var setNewSlide = function() {
            var new_idx=0;

            $current_set  = $new_set;
            $new_set = [];
            if(leftToRight===true) {
                if(changed==true)
                    current = current + counter ;
                new_idx = current + counter ;
                position = "-=";
                $new_set = $oSlides.slice(current, new_idx);
            }
            else{
                if(changed==true)
                    current = current - counter ;
                new_idx = current - counter ;
                if ( new_idx < 0 ) { new_idx =0; }
                position = "+=";
                console.log(new_idx);
                $new_set = $oSlides.slice(new_idx, current);
                console.log($new_set);
            }
            console.log("current="+current+",new="+new_idx);
            current = new_idx;
           // console.log(plugin);
        };
        var loadNewSlide = function() {
                setNewSlide();
                manageButtons($new_set);
                console.log($($current_set[0]).text());
                console.log($($new_set[0]).text());
                new_position = position + height;
                console.log(new_position);
                var delay=0;
                for (var i = 0; i < counter; i++) {
                    if ( plugin.options.showPast === true) {
                        $($current_set[i]).delay(delay).animate({top: new_position, opacity:0.4},plugin.options.duration);
                    } else {
                        $($current_set[i]).css("top",new_position).css("opacity",0.4);
                    }
                    $($new_set[i]).delay(delay+plugin.options.difference).animate({top: new_position, opacity:1},plugin.options.duration);
                    delay += plugin.options.delayIncrement;
                }
                setTimeout(function(){flag=false;}, delay+plugin.options.duration);
                $oSlides.not($.merge($current_set,$new_set)).css("top",new_position);
                $($current_set).removeClass("active");
                $($new_set).addClass("active");
        };
        var manageButtons = function($new_set,isbegin) {
              console.log(page);
              if( typeof isbegin === "undefined" || isbegin === false)
              {
                console.log("sfskdlmfskdfmlsd");
                if($new_set.length < counter) {
                    if(leftToRight===true) {
                         setVisibility("visible","hidden");
                    }
                } else {
                        if(page === 0 )
                            { setVisibility("hidden","visible");}
                        else
                            setVisibility("visible","visible");
                }
              }
              else
              {     
                  if($oSlides.length <= counter)
                    setVisibility("hidden","hidden");
                  else
                    setVisibility("hidden","visible");
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
                plugin.update();
                // on stocke une référence de notre plugin
                // pour pouvoir accéder à ses méthode publiques
                // (non utilisé dans ce plugin)
                $(this).data('customSliders', plugin);

            }

        });
    };
})(jQuery);