(function ($) {
    "use strict";
    // Language configuration
    var currentLang, isRTL;
  
    function determineLanguage(callback) {
      currentLang = localStorage.getItem("lang");
      if (currentLang) {
        isRTL = currentLang === "fa";
        callback();
      } else {
        // Get country code using Cloudflare's trace endpoint
        $.get("/cdn-cgi/trace", function (data) {
          var traceInfo = {};
          data.split('\n').forEach(function (line) {
            var parts = line.split('=');
            if (parts.length === 2) traceInfo[parts[0]] = parts[1];
          });
  
          var countryCode = traceInfo.loc || 'US';
          switch (countryCode) {
            case 'IR': currentLang = 'fa'; break;  // Iran
            case 'RU': currentLang = 'ru'; break;  // Russia
            case 'CN': currentLang = 'zh'; break;  // China
            default:   currentLang = 'en';         // All others
          }
  
          localStorage.setItem("lang", currentLang);
          isRTL = currentLang === 'fa';
          callback();
        }).fail(function () {
          currentLang = 'en';
          localStorage.setItem("lang", currentLang);
          isRTL = false;
          callback();
        });
      }
    }
  
    function initializeApplication() {
      // Set initial direction, lang attribute, and font family
      $("html")
        .attr("dir", isRTL ? "rtl" : "ltr")
        .attr("lang", currentLang)
        .css("font-family", isRTL ? "Vazirmatn, sans-serif" : "inherit");
  
      // Load translations
      $.getJSON("translations.json", function (translations) {
        updateContent(translations[currentLang]);
        setupLanguageSwitcher(translations);
      });
  
      // Initialize plugins that depend on language direction
      initializeCarousels();
    }
  
    function initializeCarousels() {
      $(".screenshot-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        dots: true,
        items: 1,
        rtl: isRTL,
      });
  
      $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        rtl: isRTL,
        navText: [
          isRTL ? '<i class="bi bi-chevron-right"></i>' : '<i class="bi bi-chevron-left"></i>',
          isRTL ? '<i class="bi bi-chevron-left"></i>' : '<i class="bi bi-chevron-right"></i>',
        ],
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
          992: { items: 3 },
        },
      });
    }
  
    // ... (keep the rest of the functions identical to previous version - updateContent, setupLanguageSwitcher, and other initializations) ...
  
    // Start application
    determineLanguage(function () {
      initializeApplication();
    });
  
    // ... (remaining code identical to previous version) ...
  
  })(jQuery);