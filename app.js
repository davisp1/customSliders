var customSliders = {
    counter : 5,
    delayIncrement : 50,
    duration : 200,
    selector : "#actu_slides",
    position : "-=",
    leftToRight : true,
    height : null,
    oElements : null,
    oContainer : null,
    flag : false,
    init : function($options) {
        this.oContainer = $(this.selector);
        this.oElements = $("div",this.oContainer).css("opacity",0.4);
        this.oElements.slice(0,this.counter).addClass("active").css("opacity",1);
        this.height = 2 + this.oElements.first().height() + "px";
        this.bindEvents();
    },
    bindEvents : function() {
        $(".prev_slide").click(function(event){
            if(customSliders.flag === false)
            {
            customSliders.leftToRight = false;
            customSliders.position = "+=";
            customSliders.loadNewSlide();
            }
        });

        $(".next_slide").click(function(event){
            if(customSliders.flag===false)
            {
            customSliders.leftToRight = true;
            customSliders.position = "-=";
            customSliders.loadNewSlide();
            }
        });
    },
    getNewSlide : function() {
        var $new_set=[];
        if( customSliders.leftToRight===true ) {
            $new_set = $("div.active:last",customSliders.oContainer).nextAll("div");
        } else {
            $new_set = $("div.active:first",customSliders.oContainer).prevAll("div");
        }
        if ( (customSliders.leftToRight===true && $new_set.length === 0) ) {
            $new_set = $("div.active:first",customSliders.oContainer).prevAll("div");
            position = "+=";
            customSliders.leftToRight=false;
        }
        if( (customSliders.leftToRight===false && $new_set.length === 0) ){
            $new_set = $("div.active:last",customSliders.oContainer).nextAll("div");
            position = "-=";
            customSliders.leftToRight=true;
        }
        return $new_set;
    },
    loadNewSlide : function() {
            var $current = $("div.active",customSliders.oContainer);
            $new_set = customSliders.getNewSlide();
            var new_position = customSliders.position + customSliders.height;
            customSliders.manageButtons($new_set);
            $new_set=$new_set.slice(0,customSliders.counter);
            if(customSliders.leftToRight===false)
                $new_set=$new_set.toArray().reverse();
            var delay=0;
            customSliders.flag=true;
            for (var i = 0; i < customSliders.counter; i++) {
                $($current[i]).css("top",new_position).css("opacity",0.4);
                $($new_set[i]).delay(delay + 5).animate({top: new_position, opacity:1},customSliders.duration);
                delay += customSliders.delayIncrement;
            }
            setTimeout(function(){customSliders.flag=false;}, delay+customSliders.duration);
            customSliders.oElements.not($.merge($current,$new_set)).css("top",new_position);
            $current.removeClass("active");
            $($new_set).addClass("active");
    },
    manageButtons : function($new_set) {
            if($new_set.length <= customSliders.counter) {
                if(customSliders.leftToRight===true)
                {
                    $(".next_slide").hide();
                    $(".prev_slide").show();
                }
                else
                {
                    $(".prev_slide").hide();
                    $(".next_slide").show();
                }
            }
            else
            {
                    $(".prev_slide").show();
                    $(".next_slide").show();
            }
    }
};