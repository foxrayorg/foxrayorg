(function ($) {
    "use strict";
    // Language configuration
    var currentLang, isRTL;
  
    function determineLanguage(callback) {
      currentLang = localStorage.getItem("lang");
      if (currentLang) {
        isRTL = ["fa"].includes(currentLang);
        callback();
      } else {
        // Get country code using ipinfo.io (replace YOUR_TOKEN with actual token)
        $.get("https://ipinfo.io/json?token=YOUR_TOKEN", function (data) {
          currentLang = data.country === "IR" ? "fa" : "en";
          localStorage.setItem("lang", currentLang);
          isRTL = currentLang === "fa";
          callback();
        }).fail(function () {
          currentLang = "en";
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
          '<i class="bi bi-chevron-left"></i>',
          '<i class="bi bi-chevron-right"></i>',
        ],
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
          992: { items: 3 },
        },
      });
    }
  
    function updateContent(langData) {
      $("[data-i18n]").each(function () {
        var key = $(this).data("i18n");
        $(this).text(langData[key] || $(this).text());
      });
    }
  
    function setupLanguageSwitcher(translations) {
      $(".lang-select").on("click", function (e) {
        e.preventDefault();
        var lang = $(this).data("lang");
        localStorage.setItem("lang", lang);
        currentLang = lang;
        isRTL = ["fa"].includes(lang);
        
        $("html")
          .attr("dir", isRTL ? "rtl" : "ltr")
          .attr("lang", lang)
          .css("font-family", isRTL ? "Vazirmatn, sans-serif" : "inherit");
        
        $("body").toggleClass("rtl", isRTL);
        updateContent(translations[lang]);
        
        // Reinitialize plugins
        new WOW().init();
        $('[data-toggle="counter-up"]').counterUp({
          delay: 10,
          time: 2000,
        });
        
        // Reinitialize carousels with new direction
        $(".screenshot-carousel, .testimonial-carousel")
          .data("owl.carousel")
          .destroy();
        initializeApplication();
      });
    }
  
    // Start application
    determineLanguage(function () {
      initializeApplication();
    });
  
    // Common initializations (language-independent)
    var spinner = function () {
      setTimeout(function () {
        if ($("#spinner").length > 0) {
          $("#spinner").removeClass("show");
        }
      }, 1);
    };
    spinner();
  
    new WOW().init();
  
    $(window).scroll(function () {
      if ($(this).scrollTop() > 45) {
        $(".navbar").addClass("sticky-top shadow-sm");
      } else {
        $(".navbar").removeClass("sticky-top shadow-sm");
      }
    });
  
    $(".navbar-nav a").on("click", function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop: $(this.hash).offset().top - 45,
          },
          1500,
          "easeInOutExpo"
        );
        if ($(this).parents(".navbar-nav").length) {
          $(".navbar-nav .active").removeClass("active");
          $(this).closest("a").addClass("active");
        }
      }
    });
  
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $(".back-to-top").fadeIn("slow");
      } else {
        $(".back-to-top").fadeOut("slow");
      }
    });
  
    $(".back-to-top").click(function () {
      $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
      return false;
    });
  
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 2000,
    });
  })(jQuery);