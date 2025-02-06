(function ($) {
    "use strict";

    // Language configuration
    var currentLang = localStorage.getItem('lang') || 'en';
    var isRTL = ['fa'].includes(currentLang);
    
    // Set initial direction and lang attribute
    $('html').attr('dir', isRTL ? 'rtl' : 'ltr').attr('lang', currentLang);
    
    // Load translations
    $.getJSON('translations.json', function(translations) {
        updateContent(translations[currentLang]);
        setupLanguageSwitcher(translations);
    });

    function updateContent(langData) {
        $('[data-i18n]').each(function() {
            var key = $(this).data('i18n');
            $(this).text(langData[key] || $(this).text());
        });
    }

    function setupLanguageSwitcher(translations) {
        $('.lang-select').on('click', function(e) {
            e.preventDefault();
            var lang = $(this).data('lang');
            localStorage.setItem('lang', lang);
            currentLang = lang;
            isRTL = ['fa'].includes(lang);
            
            // Update document attributes
            $('html').attr('dir', isRTL ? 'rtl' : 'ltr').attr('lang', lang);
            $('body').toggleClass('rtl', isRTL);
            
            // Update content
            updateContent(translations[lang]);
            
            // Reinitialize plugins if needed
            new WOW().init();
            $('[data-toggle="counter-up"]').counterUp({
                delay: 10,
                time: 2000
            });
        });
    }

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    // Screenshot carousel
    $(".screenshot-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        dots: true,
        items: 1,
        rtl: isRTL
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        rtl: isRTL,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });

})(jQuery);