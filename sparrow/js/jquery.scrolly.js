/*
 *  Project: Scrolly : parallax is easy as a matter of fact !
 *  Description: Based on jQuery boilerplate
 *  Author: Victor C. / Octave & Octave web agency
 */

    /**
     * check if is in mobile mode or isnt
     * if responsive checker is visible -> mobile mode
     * @returns {unresolved}
     */
    isResponsive = function() {
        if($('#responsive-checker').css('display') === 'none'){
            return false;
        }
        return true;
    };

(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName = 'scrolly',
        defaults = {
            bgParallax: false,
            responsive: false
        },
        didScroll = false;


    function Plugin( element, options ) {
        this.element = element;
        this.$element = $(this.element);

        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }
    
   
    
    Plugin.prototype.init = function () {

        var self = this;
        this.startPosition = parseNumber(this.$element.position().top);
        
        this.parentDefPos = this.$element.css('position');
        if(!this.options.bgParallax && this.$element.parent().css('position') !== 'absolute' && this.$element.parent().css('position') !== 'relative'){
            this.$element.parent().css('position', 'absolute').css('overflow-y','hidden');
        }
        
        this.offsetTop = this.$element.offset().top;
        this.height = this.$element.outerHeight(true);
        this.velocity = this.$element.attr('data-velocity');
        this.bgStart = parseNumber(this.$element.attr('data-fit'));
        
        self.scrolly();
        
        $(document).scroll(function(){
            self.scrolly();
        });
        $(window).resize(function(){ 
            self.scrolly();
        });

//        DEFAULT PART OF CODE, EVERY 10 MILISECONDS TEST, IF WEBSITE WAS SCROLLED
//        $(document).scroll(function(){
//            self.didScroll = true;
//        });
//        
//        setInterval(function() {
//            if (self.didScroll) {
//                self.didScroll = false;
//                self.scrolly();
//            }
//        }, 10);

    };

    Plugin.prototype.scrolly = function() {
        var dT =  $(window).scrollTop(),
            wH = $(window).height(),
            position = this.startPosition;

      if (!isResponsive()) {
            if (this.offsetTop >= (dT + wH)) {
                this.$element.addClass('scrolly-invisible');
            } else {
                if (this.$element.hasClass('scrolly-invisible')) {
                    position = this.startPosition + (dT + (wH - this.offsetTop)) * this.velocity;
                } else {
                    position = this.startPosition + dT * this.velocity;
                }
            }
            // Fix background position
            if(this.bgStart){ position = position + this.bgStart; }
        }
        else {
                this.$element.parent().css('position', this.parentDefPos);
        }
            // Fix background position
            if(this.bgStart){ position = position + this.bgStart; }
 
  

        if(this.options.bgParallax === true) {
            this.$element.css({backgroundPosition: '50% '+position+'px'});
        } else {
            this.$element.css({top: position});
        }
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

})(jQuery, window, document);