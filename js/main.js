(function ($) {
    "use strict";

    $(document).ready(async function () {
        // Determine initial language
        let currentLang = localStorage.getItem('lang');
        const isInitialLoad = !currentLang;

        if (isInitialLoad) {
            try {
                const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
                const traceData = await response.text();
                const countryCode = traceData.split('\n')
                    .find(line => line.startsWith('loc='))
                    ?.split('=')[1] || '';

                // Add your country to language mappings here
                currentLang = {
                    'IR': 'fa', // Iran -> Farsi
                    'RU': 'ru', // Spain -> Spanish
                    'CN': 'zh', // France -> French
                    // Add more country codes as needed
                }[countryCode] || 'en';
            } catch {
                currentLang = 'en';
            }
        }

        // Initialize RTL settings
        let isRTL = ['fa'].includes(currentLang);
        $('html').attr('dir', isRTL ? 'rtl' : 'ltr')
            .attr('lang', currentLang)
            .css('font-family', isRTL ? 'Vazirmatn, sans-serif' : 'inherit');

        // Load translations and initialize
        const translations = await $.getJSON('translations.json');
        updateContent(translations[currentLang]);
        setupLanguageSwitcher(translations);

        // Original initialization code
        // ------------------------------
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
            $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
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
    });

    function updateContent(langData) {
        $('[data-i18n]').each(function () {
            var key = $(this).data('i18n');
            $(this).text(langData[key] || $(this).text());
        });
    }

    function setupLanguageSwitcher(translations) {
        $('.lang-select').on('click', function (e) {
            e.preventDefault();
            var lang = $(this).data('lang');
            localStorage.setItem('lang', lang);
            
            const isRTL = ['fa'].includes(lang);
            $('html').attr('dir', isRTL ? 'rtl' : 'ltr')
                .attr('lang', lang)
                .css('font-family', isRTL ? 'Vazirmatn, sans-serif' : 'inherit');
            
            updateContent(translations[lang]);
            $('[data-toggle="counter-up"]').counterUp({
                delay: 10,
                time: 2000
            });
            
            // Reinitialize carousels with new RTL setting
            $(".screenshot-carousel").data('owlCarousel').options.rtl = isRTL;
            $(".testimonial-carousel").data('owlCarousel').options.rtl = isRTL;
            new WOW().init();
        });
    }
})(jQuery);