document.addEventListener('DOMContentLoaded', function() {
    "use strict";

    // Language configuration
    let currentLang = localStorage.getItem('lang') || 'en';
    let isRTL = ['fa'].includes(currentLang);
    const htmlElement = document.documentElement;
    
    // Set initial attributes
    htmlElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    htmlElement.setAttribute('lang', currentLang);
    htmlElement.style.fontFamily = isRTL ? 'Vazirmatn, sans-serif' : 'inherit';

    // Load translations
    fetch('translations.json')
        .then(response => response.json())
        .then(translations => {
            updateContent(translations[currentLang]);
            setupLanguageSwitcher(translations);
        })
        .catch(error => console.error('Error loading translations:', error));

    function updateContent(langData) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = langData[key] || element.textContent;
        });
    }

    function setupLanguageSwitcher(translations) {
        document.querySelectorAll('.lang-select').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.dataset.lang;
                localStorage.setItem('lang', lang);
                currentLang = lang;
                isRTL = ['fa'].includes(lang);

                // Update document attributes
                htmlElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
                htmlElement.setAttribute('lang', lang);
                htmlElement.style.fontFamily = isRTL ? 'Vazirmatn, sans-serif' : 'inherit';
                document.body.classList.toggle('rtl', isRTL);

                // Update content
                updateContent(translations[lang]);

                // Reinitialize animations
                new WOW().init();
            });
        });
    }

    // Spinner
    function hideSpinner() {
        setTimeout(() => {
            const spinner = document.getElementById('spinner');
            if (spinner) spinner.classList.remove('show');
        }, 1);
    }
    hideSpinner();

    // Initialize animations
    new WOW().init();

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('sticky-top', window.scrollY > 45);
        navbar.classList.toggle('shadow-sm', window.scrollY > 45);
    });

    // Smooth scrolling
    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash) {
                e.preventDefault();
                const target = document.querySelector(this.hash);
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 45;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update active class
                    document.querySelectorAll('.navbar-nav .active').forEach(el => el.classList.remove('active'));
                    this.closest('a').classList.add('active');
                }
            }
        });
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.style.display = window.scrollY > 100 ? 'block' : 'none';
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Note: The following jQuery plugins need alternative solutions:
    // - CounterUp
    // - Owl Carousel
    // You'll need to implement vanilla JS alternatives for these features
});