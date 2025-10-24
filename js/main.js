// ===================================
// BARETTO Espressobar - Main JavaScript
// Interactive Features & Smooth UX
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== Navigation Functionality =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Back to Top Button =====
    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== Contact Form Handling =====
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission (replace with actual backend call)
            showNotification('Thank you! Your message has been sent. We\'ll get back to you soon!', 'success');
            contactForm.reset();

            // In production, you would send this data to your backend:
            // fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // })
            // .then(response => response.json())
            // .then(data => {
            //     showNotification('Message sent successfully!', 'success');
            //     contactForm.reset();
            // })
            // .catch(error => {
            //     showNotification('Something went wrong. Please try again.', 'error');
            // });
        });
    }

    // Notification function
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 20px 30px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            font-size: 1rem;
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== Lazy Loading Images =====
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===== Animate on Scroll =====
    const animateOnScrollElements = document.querySelectorAll('.feature-item, .menu-item, .review-card, .info-card, .contact-card');

    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, {
            threshold: 0.1
        });

        animateOnScrollElements.forEach(el => {
            el.style.opacity = '0';
            scrollObserver.observe(el);
        });
    }

    // ===== Social Media Click Tracking (Optional Analytics) =====
    const socialLinks = document.querySelectorAll('.social-links a, .footer-social a');

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('aria-label') || 'Social';
            console.log(`Social link clicked: ${platform}`);

            // Add your analytics tracking here
            // Example: gtag('event', 'social_click', { platform: platform });
        });
    });

    // ===== Phone Call Tracking =====
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Phone call initiated');
            // Add your analytics tracking here
            // Example: gtag('event', 'phone_call', { number: this.href });
        });
    });

    // ===== Opening Hours Highlight =====
    function highlightCurrentDay() {
        const hoursList = document.querySelector('.hours-list');
        if (!hoursList) return;

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[new Date().getDay()];

        const listItems = hoursList.querySelectorAll('li');
        listItems.forEach(item => {
            const text = item.textContent;
            if (text.includes(currentDay) ||
                (currentDay !== 'Saturday' && currentDay !== 'Sunday' && text.includes('Monday - Friday')) ||
                ((currentDay === 'Saturday' || currentDay === 'Sunday') && text.includes('Saturday - Sunday'))) {
                item.style.background = 'rgba(139, 69, 19, 0.1)';
                item.style.padding = '8px';
                item.style.borderRadius = '5px';
                item.style.fontWeight = '600';
            }
        });
    }

    highlightCurrentDay();

    // ===== Scroll Progress Indicator =====
    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, #8B4513, #D2691E);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // ===== Performance Monitoring (Optional) =====
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);

                // Send to analytics if needed
                // Example: gtag('event', 'timing_complete', {
                //     name: 'load',
                //     value: pageLoadTime
                // });
            }, 0);
        });
    }

    // ===== Easter Egg: Coffee Counter =====
    let coffeeClicks = 0;
    const heroTitle = document.querySelector('.hero-title');

    if (heroTitle) {
        heroTitle.addEventListener('click', () => {
            coffeeClicks++;
            if (coffeeClicks === 5) {
                showNotification('☕ You love coffee as much as we do! Come visit us! ☕', 'success');
                coffeeClicks = 0;
            }
        });
    }

    // ===== Prevent Right-Click on Images (Optional Protection) =====
    // Uncomment if you want to protect images
    // document.querySelectorAll('img').forEach(img => {
    //     img.addEventListener('contextmenu', e => e.preventDefault());
    // });

    console.log('🎉 BARETTO Espressobar website loaded successfully!');
});

// ===== Service Worker for PWA (Optional) =====
// Uncomment to enable Progressive Web App features
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
//         .then(reg => console.log('Service Worker registered'))
//         .catch(err => console.log('Service Worker registration failed'));
// }
