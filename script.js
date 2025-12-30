/* ===================================================
   DS FINANCIAL SOLUTIONS - JAVASCRIPT
   Interactive Features & Animations
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==================== THEME TOGGLE ====================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // ==================== MOBILE NAV TOGGLE ====================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==================== ACTIVE NAV LINK ====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ==================== SCROLL ANIMATIONS ====================
    const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ==================== NUMBER COUNTER ANIMATION ====================
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                animateCounter(target, countTo);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // ==================== BACK TO TOP BUTTON ====================
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==================== CONTACT FORM ====================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Success state
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00C853 0%, #00E676 100%)';

                // Reset form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ==================== NEWSLETTER FORM ====================
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const button = this.querySelector('button');

            if (input.value) {
                button.innerHTML = '<i class="fas fa-check"></i>';
                input.value = '';

                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-arrow-right"></i>';
                }, 2000);
            }
        });
    }

    // ==================== SERVICE CARDS STAGGER ANIMATION ====================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ==================== INDUSTRY ITEMS STAGGER ANIMATION ====================
    const industryItems = document.querySelectorAll('.industry-item');
    industryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
    });

    // ==================== WHY CARDS STAGGER ANIMATION ====================
    const whyCards = document.querySelectorAll('.why-card');
    whyCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ==================== PARALLAX EFFECT FOR HERO ====================
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });

    // ==================== FLOATING CARDS MOUSE INTERACTION ====================
    const floatingCards = document.querySelectorAll('.floating-card');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 10;
            const x = mouseX * speed;
            const y = mouseY * speed;
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ==================== FORM INPUT ANIMATIONS ====================
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // ==================== TYPEWRITER EFFECT (Optional) ====================
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // ==================== TESTIMONIAL AUTO-SCROLL (Optional) ====================
    // Can be enabled if carousel behavior is needed
    /*
    const testimonialSlider = document.querySelector('.testimonials-slider');
    let scrollAmount = 0;
    
    setInterval(() => {
        if (testimonialSlider) {
            scrollAmount += testimonialSlider.offsetWidth / 3;
            if (scrollAmount >= testimonialSlider.scrollWidth - testimonialSlider.offsetWidth) {
                scrollAmount = 0;
            }
            testimonialSlider.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }, 5000);
    */

    // ==================== PRELOADER (Optional) ====================
    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // ==================== CONSOLE BRANDING ====================
    console.log('%c DS Financial Solutions ', 'background: #1A237E; color: #FFB300; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
    console.log('%c Built with ❤️ by Deepanshu Sharma ', 'color: #757575; font-size: 12px;');
});
