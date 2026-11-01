/*
 * MAIN SCRIPT
 * control JavaScript functions 
 */

//var owlInstagramCarousel;

var owlCarouselSelector;
var owlCarouselInstance;
var modalId = '#modal-windows';
var modalOverlayId = '#modal-overlay';

$.fn.isOnScreen = function(before) {
    
    if (before === null)
    {
        before = 0;
    }

    var win = $(window);

    var viewport = {
        top: win.scrollTop(),
        left: win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight() + before;
    bounds.top = bounds.top - before;

    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

};

/* -------------------------------------------------------------------------
 *      jquery validator
 ------------------------------------------------------------------------ */
$.validator.setDefaults({
    errorClass: "invalid",
    validClass: "valid",
    errorElement: "span",
    ignore: [], // stop ignoring hidden form elements
    errorLabelContainer: ".validation-messages-wrapp .errors-hidden",
    onkeyup: false,
    highlight: function(element, errorClass, validClass) {
        var $element = $(element);
        $element.addClass(errorClass).removeClass(validClass);
    },
    unhighlight: function(element, errorClass, validClass) {
        var $element = $(element);
        if($(element).val() !== "" && $(element).val() !== null){      
            $element.removeClass(errorClass).addClass(validClass);
        }
    }
    , invalidHandler: function(form, validator) {
        if (!validator.numberOfInvalids())
            return;
        var label_for = $(validator.errorList[0].element).attr('name');

        var scroll_to_el = $('body').find('label[for="' + label_for + '"]');
        if (!(scroll_to_el.length > 0)) {
            scroll_to_el = $('body').find('label[data-for="' + label_for + '"]');
            if (!(scroll_to_el.length > 0)) {
                scroll_to_el = $(validator.errorList[0].element);
            }
        }
        var scroll_to = scroll_to_el.offset().top - 50;
        $('html, body').animate({
            scrollTop: scroll_to
        }, 200);
    }
});



/**
 * load instagram photos json
 * @param {type} getUrl
 * @returns {undefined}
 */
loadInstagramPhotos = function(getUrl){
    $.ajax({
        url: getUrl,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'getInstagramPhotos'
    });
};

/**
 * get instagram photos from json
 * @param {type} instaUrl
 * @returns {undefined}
 */
getInstagramPhotos = function(data)
{   
    var pasteToEl = $('#suegentryart-instagram-photos');
    var item_string = '';
    var items = [];

    $.each(data.data, function(key, val) {
        
        var images = val.images;
        var full_url = images.standard_resolution.url;
        var thumbnail_url = images.low_resolution.url;
        var caption = val.caption.text;
        
        item_string = '<li>';
        item_string = '<a href="' + full_url + '" class="image-lightbox" data-image-lightbox="suegentryart-instagram-photo"><img src="' + thumbnail_url + '" alt="'+caption+'" /></a>';
        item_string = item_string + '</li>';

        items.push(item_string);
    });

    $("<ul/>", {
        "class": "owl-carousel",
        html: items.join("")
    }).appendTo(pasteToEl);


    owlCarouselSelector = $("#suegentryart-instagram-photos .owl-carousel");
    owlCarouselSelector.owlCarousel({
        loop: true,
        margin: 25,
        center: true,
        autoWidth: true,
        items: 3,
        nav: true,
        autoplay: true,
        autoplayTimeout: 1300,
        autoplayHoverPause: true,
        navText: ['<svg height="23" width="23"><polygon points="23,0 23,23 0,12" style="fill:rgba(0,0,0,.8);" /></svg>', '<svg height="23" width="23"><polygon points="0,0 0,23 23,12" style="fill:rgba(0,0,0,.8);" /></svg>']
        
    });
    owlCarouselInstance = owlCarouselSelector.data('owlCarousel');
    
    
        var instagramLightboxSelector = 'a[data-image-lightbox="suegentryart-instagram-photo"]';

    var instagramLightbox = $(instagramLightboxSelector).imageLightbox(
            {
                allowedTypes: 'png|jpg|jpeg|gif', // string;
                animationSpeed: 250, // integer;
                onStart: function() {
                    overlayOn();
                    closeButtonOn(instagramLightbox);
//                    arrowsOn(instagramLightbox, instagramLightboxSelector);
                },
                onEnd: function() {
                    overlayOff();
                    captionOff();
                    closeButtonOff();
                    arrowsOff();
                    activityIndicatorOff();
                },
                onLoadStart: function() {
                    captionOff();
                    activityIndicatorOn();
                },
                onLoadEnd: function() {
                    captionOn();
                    activityIndicatorOff();
                    $('.imagelightbox-arrow').css('display', 'block');
                }
            });
    
    };
    
    referencesOwlCarouselSelector = $("#paintings  .owl-carousel");
    referencesOwlCarouselSelector.owlCarousel({
        loop: false,
        center: true,
        autoWidth: true,
        nav: true,
        URLhashListener:true,
        startPosition: 'URLHash'
    });

/**
 * when document is loaded, start ParticleGround
 * @param {type} param1
 * @param {type} param2
 * @param {type} param3
 */
//particleGroundElId = 'sg-space-anim-bg';
//particleGroundInstance = null;
//document.addEventListener('DOMContentLoaded', function() {
//    particleGroundEl = document.getElementById(particleGroundElId);
//    particleGroundInstance = particleground(particleGroundEl);
//}, false);


/* -----------------------------------------------------------------------------
                MODAL FUNCTIONS
 ---------------------------------------------------------------------------- */
/* show modal function */
function showModal(showModalId, clickedId) {
    var mainModal = $(modalId);
    /* if modal is opened or I'm changing modal window content, I neeed to clear messages wrapps */
    if (mainModal.css('display') === 'none') {
        setModalContent(showModalId, clickedId);
        showModals(showModalId);
    }
    else if (mainModal.css('display') === 'block') {
        setModalContent(showModalId, clickedId);
    }
};
/* hide modal function */
function hideModal() {
    var mainModal = $(modalId);
    mainModal.hide();
    mainModal.find('.visible').each(function() {
        $(this).removeClass('visible');
    });

    var scrolltop = Math.abs($('.body-temp').position().top);
    $('body').append($('.body-temp').contents()).scrollTop(scrolltop);

    mainModal.find('.validation-messages-wrapp').each(function() {
        $(this).find('.errors').html('').hide();
        $(this).find('.errors_hidden').html('').hide();
        $(this).find('.successes').html('').hide();
    });
    mainModal.find('input,label,textarea').each(function(){
        $(this).removeClass('valid').removeClass('invalid').val('');
    });
    
}
/* show modals */
function showModals(showModalId) {
    var mainModal = $(modalId);
    mainModal.show();
    var scrollTop = $(window).scrollTop();
                                 body_temp = $("<div class='body-temp' />")
                                    .append($('body').contents())
                                    .css('position', 'fixed')
                                    .css('top', '-' + scrollTop + 'px')
                                    .css('overflow-y', 'scroll')
                                    .width($(window).width())
                                    .appendTo('body');
    mainModal.find('#' + showModalId).addClass('visible');
}
/* set modal content */
function setModalContent(modalElId, clickedId) {
    enableElGroup('contact-text');
    hide_sub('contact-text');
    var mainModal = $(modalId);
    var openModal = mainModal.find('.modal-window#' + modalElId);
    mainModal.find('.modal-window.visible').each(function() {
        $(this).removeClass('visible');
    });
    if(typeof clickedId !== 'undefined') {
        var clickedEl = $('#' + clickedId + '');
        var preFill = clickedEl.attr('data-pre-fill');
        if (typeof preFill !== typeof undefined && preFill !== false) {
            openModal.find('.pre-fill').val(preFill);
            show_sub('contact-text');
            disableElGroup('contact-text');
        }
    }
    openModal.addClass('visible');
};


/**
 * init waypoints for elements
 * @param items
 * @param trigger
 */
function onScrollInit( items, trigger ) {
    items.each( function() {
        var osElement = $(this);
            setElAnimation(osElement);

        var osTrigger = ( trigger ) ? trigger : osElement;

        osTrigger.waypoint(function() {
            animateEl(osElement);
        },{
            triggerOnce: true,
            offset: '90%'
        });
    });
}


function setElAnimation(osElement) {
    osAnimationClass = osElement.attr('data-animation');
    osAnimationDelay = osElement.attr('data-animation-delay');
    osAnimationDuration = osElement.attr('data-animation-duration');

    if (typeof osAnimationDelay === typeof undefined || osAnimationDelay === false) {
        osAnimationDelay = 0;
    }
    if (typeof osAnimationDuration !== typeof undefined && osAnimationDuration !== false) {
        osElement.css({
            '-webkit-animation-duration':  osAnimationDuration,
            '-moz-animation-duration':     osAnimationDuration,
            'animation-duration':          osAnimationDuration
        });
    }

    osElement.css({
        '-webkit-animation-delay':  osAnimationDelay,
        '-moz-animation-delay':     osAnimationDelay,
        'animation-delay':          osAnimationDelay
    });
}


function animateEl(osElement) {
    osElement.addClass('animated').addClass(osElement.attr('data-animation'));
}


$(document).ready(function() {


    /**
     * waypoints
     */
    onScrollInit( $('.waypoint') );



 /*   $('.parallax').scrolly({
        responsive: false
    });
    $('.parallax-resp').scrolly({
        responsive: true
    });
    $('.parallax-bg').scrolly({
        bgParallax: true
    });
    */
    
    /*
     * allow opening of hidden elements
     */
    $(document).on('click', '.sub-opener:not(.disabled)', function(e) {
        e.preventDefault();
        var new_el_id = $(this).attr('data-sub-open');
        show_sub(new_el_id);
    });
    
    $(document).on('click', '.sub-closer', function(e){
            hide_all_sub();
    });
    
    $(document).mouseup(function (e)
    {
        var sub_content = $('.sub-content.visible');

        if (!sub_content.is(e.target) // if the target of the click isn't the container...
            && sub_content.has(e.target).length === 0
            && !sub_content.hasClass('not-auto-hide')
        ) // ... nor a descendant of the container
        {
            hide_sub(null, sub_content);
        }
    });
    
    /*
     * enable smooth scrolling for internal links
     */
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;
        if (hash.length > 1) {
            smoothScrollTo(hash);
        }
    });
    
    
    /* ---------------------------------  
     main modal functions
     ---------------------------------*/
    $(document).on('click', '.show-modal', function(e) {
        e.preventDefault();
        var clicked_el = $(this);
        var modal_id = clicked_el.attr('data-modal-id');
        var clicked_id = clicked_el.attr('id');
        showModal(modal_id, clicked_id);
    });

    $(document).on('click', '.modal-close', function(e) {
        e.preventDefault();
        hideModal();
    });

    /* -------------------------------------------------------------------------
     *      jQuery particleground plugin
     ------------------------------------------------------------------------ */
    /**
     * if particleground is not in viewport, pause it
     */
//    $(window).scroll(function() {
//        if ($('#'+particleGroundElId).isOnScreen(100) === true && $('#'+particleGroundElId).find('canvas').is(":visible"))
//        {   
//            particleGroundInstance.start();
//        }
//        else {
//            particleGroundInstance.pause();
//        }
//    });


    /* -------------------------------------------------------------------------
     *      jQuery instagram photos lightbox plugin
     ------------------------------------------------------------------------ */
//    var instagramLightboxSelector = 'a[data-image-lightbox="suegentryart-instagram-photo"]';
//
//    var instagramLightbox = $(instagramLightboxSelector).imageLightbox(
//            {
//                allowedTypes: 'png|jpg|jpeg|gif', // string;
//                animationSpeed: 250, // integer;
//                onStart: function() {
//                    overlayOn();
//                    closeButtonOn(instagramLightbox);
//                    arrowsOn(instagramLightbox, instagramLightboxSelector);
//                },
//                onEnd: function() {
//                    overlayOff();
//                    captionOff();
//                    closeButtonOff();
//                    arrowsOff();
//                    activityIndicatorOff();
//                },
//                onLoadStart: function() {
//                    captionOff();
//                    activityIndicatorOn();
//                },
//                onLoadEnd: function() {
//                    captionOn();
//                    activityIndicatorOff();
//                    $('.imagelightbox-arrow').css('display', 'block');
//                }
//            });

    /*
     * StartToday button press action
     */
//    $(document).on('click', '#start-today', function(e) {
//        e.preventDefault();
//        smoothScrollTo('#suegentryart');
//        show_sub('write-us');
//    });

    /* -------------------------------------------------------------------------
     *      contact form validate
     ------------------------------------------------------------------------ */
    contact_form = $('#contact-form');
    contact_form_validation_messages = contact_form.find('.validation-messages-wrapp');
    
    contact_form_validation_messages_errs = contact_form_validation_messages.find('.errors');
    contact_form_validation_messages_sccs = contact_form_validation_messages.find('.successes');
    
    contact_form_validate = contact_form.validate({
        rules: {
            'contact-data': {
                required: true
            }
        }
        ,
        submitHandler: function(form, e) {
            e.preventDefault();
        }
    });

    contact_form.find('button[name="send-contact-form"]').on('click', function(e) {
        e.preventDefault();
        if (contact_form.valid()) {
             var proccess_url = 'http://suegentryart.com/ajax'+contact_form.attr('action')+'.php';
            var form_data = contact_form.serialize();
            $.post(proccess_url, form_data, function(data) {
                message = '<span>'+data.message+'</span>';
                if (data.return === true) { //success
                    showModal('thank-you-form-modal');
                    contact_form[0].reset();
                    contact_form.find('input.valid, textarea.valid').each(function(){
                        $(this).removeClass('valid');
                    });
                } else { // error
                    contact_form_validation_messages_errs.html(message);
                }
            }, "json");
        }
    });

});


/**
 * smooth scroll to element by its hash
 * @param {type} targetHash
 * @returns {undefined}
 */
var smoothScrollTo = function(targetHash) {
    var $target = $(targetHash);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function() {
        window.location.hash = targetHash;
    });
};



/**
 * hide all opened mobile sub contents
 * @returns {undefined}
 */
var hide_all_sub = function(el_id) {

    // loop through all visible elements, except the new one
    $(document).find('.sub-content.visible:not([data-sub-id="' + el_id + '"])').each(function() {
        // check if new element is children of a visible element, if no, hide the element, if yes, let it being visible
        if (!$(this).find('.sub-content[data-sub-id="' + el_id + '"]').length) {
            hide_sub($(this).attr('data-sub-id'));
        }
    });
};

/**
 * show mobile sub content
 * @param {type} el_id
 * @returns {undefined}
 */
var show_sub = function(el_id) {

    hide_all_sub(el_id);
    if(el_id !== 'undefined'){
    var content = $(document).find('.sub-content[data-sub-id="' + el_id + '"]');
    var move = content.attr('data-move');
    
    if (content.hasClass('visible'))
    {
        if(el_id === 'menu')
        {
            content.find('.animate').each(function(){
               $(this).removeClass($(this).attr('data-animation'));
            });
        }

        if(move === 'slide-left'){
            content.addClass('hidden').removeClass('visible');
        }
        else if(move === 'slide-down'){
            content.slideUp('fast', function(){
                content.addClass('hidden').removeClass('visible');
            });
        }
        else {
                content.addClass('hidden').removeClass('visible');
        }
        $(document).find('.sub-opener[data-sub-open="' + el_id + '"]').removeClass('opened');
    }
    else {

        if(el_id === 'menu')
        {
            content.find('.animate').each(function(){
                setElAnimation($(this));
                animateEl($(this));
            });
        }

        if(move === 'slide-left') {
            content.addClass('visible').removeClass('hidden');
        }
        else if(move === 'slide-down'){
            content.slideDown('fast', function(){
                content.removeClass('hidden').addClass('visible');
            });
        }
        else {
                content.removeClass('hidden').addClass('visible');
        }
        $(document).find('.sub-opener[data-sub-open="' + el_id + '"]').addClass('opened');
    }

        disableElGroup(el_id);



    }
};

var disableElGroup = function(el_id) {
    var el = $(document).find('.sub-opener[data-sub-open="'+el_id+'"]');

    if(el.hasClass('disable-group')) {
        var group_id = el.attr('data-group-id');
        $(document).find('.sub-opener[data-group-id="'+group_id+'"]').each(function(){
            $(this).addClass('disabled');
        });
    }
}


var enableElGroup = function(el_id) {
    var el = $(document).find('.sub-opener[data-sub-open="'+el_id+'"]');

    if(el.hasClass('disable-group')) {
        var group_id = el.attr('data-group-id');
        $(document).find('.sub-opener[data-group-id="'+group_id+'"]').each(function(){
            $(this).removeClass('disabled');
        });
    }
}

/**
 * hide mobile sub content
 * @param {type} el_id
 * @returns {undefined}
 */
var hide_sub = function(el_id, sub_content_el) {
    if(typeof sub_content_el === 'undefined'){
        var sub_content_el = $(document).find('.sub-content[data-sub-id="' + el_id + '"]');
    }
    else {
        el_id = sub_content_el.attr('data-sub-id');
    }
    var move = sub_content_el.attr('data-move');
    
    if (move === 'slide-left') {
        sub_content_el.addClass('hidden').removeClass('visible');
    }
    else if (move === 'slide-down') {
        sub_content_el.slideUp('fast', function() {
            sub_content_el.addClass('hidden').removeClass('visible');
        });
    }
    else {
        sub_content_el.hide('fast', function() {
            sub_content_el.addClass('hidden').removeClass('visible');
        });
    }

    $(document).find('.sub-opener[data-sub-open="' + el_id + '"]').removeClass('opened');
};