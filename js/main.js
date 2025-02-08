(function ($) {
    "use strict";
    
    // Language mapping from country codes to language codes
    const countryToLang = {
      'IR': 'fa',  // Iran -> Farsi
      'RU': 'ru',
      'CN': 'zh',
      // Add more country to language mappings as needed
      'DEFAULT': 'en'  // Default language
    };
  
    // Function to parse Cloudflare trace data
    function parseTraceData(text) {
      const lines = text.split('\n');
      const data = {};
      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          data[key.trim()] = value.trim();
        }
      });
      return data;
    }
  
    // Function to initialize language based on location
    function initializeLanguage() {
      // First check if user has a stored preference
      const storedLang = localStorage.getItem('lang');
      if (storedLang) {
        setLanguage(storedLang);
        return;
      }
  
      // If no stored preference, fetch location from Cloudflare
      fetch('https://www.cloudflare.com/cdn-cgi/trace')
        .then(response => response.text())
        .then(data => {
          const traceData = parseTraceData(data);
          const countryCode = traceData.loc;
          const detectedLang = countryToLang[countryCode] || countryToLang.DEFAULT;
          setLanguage(detectedLang);
        })
        .catch(error => {
          console.error('Error fetching location:', error);
          setLanguage(countryToLang.DEFAULT);
        });
    }
  
    // Function to set language and update UI
    function setLanguage(lang) {
      const isRTL = ['fa'].includes(lang);
      
      // Update HTML attributes and font
      $('html')
        .attr('dir', isRTL ? 'rtl' : 'ltr')
        .attr('lang', lang)
        .css('font-family', isRTL ? 'Vazirmatn, sans-serif' : 'inherit');
      
      $('body').toggleClass('rtl', isRTL);
  
      // Load translations and update content
      $.getJSON('translations.json', function(translations) {
        updateContent(translations[lang]);
        setupLanguageSwitcher(translations, isRTL);
      });
    }
  
    function updateContent(langData) {
      $('[data-i18n]').each(function() {
        var key = $(this).data('i18n');
        $(this).text(langData[key] || $(this).text());
      });
    }
  
    function setupLanguageSwitcher(translations, isRTL) {
      $('.lang-select').on('click', function(e) {
        e.preventDefault();
        var lang = $(this).data('lang');
        localStorage.setItem('lang', lang);
        setLanguage(lang);
        
        // Reinitialize plugins
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
  
    // Initialize language on page load
    initializeLanguage();
  
  })(jQuery);