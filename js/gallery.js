// ===================================
// BARETTO Espressobar - Gallery & Lightbox
// Interactive Image Gallery with Lightbox
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== Gallery Lightbox Functionality =====
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt,
        caption: item.querySelector('.gallery-caption')?.textContent || ''
    }));

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyPress);
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyPress);
    }

    // Update lightbox image
    function updateLightboxImage() {
        const currentImage = images[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;

        // Preload next and previous images for smoother navigation
        if (currentImageIndex > 0) {
            const prevImg = new Image();
            prevImg.src = images[currentImageIndex - 1].src;
        }
        if (currentImageIndex < images.length - 1) {
            const nextImg = new Image();
            nextImg.src = images[currentImageIndex + 1].src;
        }
    }

    // Show previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
        animateImageTransition('prev');
    }

    // Show next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
        animateImageTransition('next');
    }

    // Animate image transition
    function animateImageTransition(direction) {
        lightboxImage.style.animation = 'none';
        setTimeout(() => {
            lightboxImage.style.animation = direction === 'next' ?
                'slideInRight 0.3s ease' :
                'slideInLeft 0.3s ease';
        }, 10);
    }

    // Handle keyboard navigation
    function handleKeyPress(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }

    // Add click events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });

        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Open image ${index + 1} in lightbox`);

        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - show next
                showNextImage();
            } else {
                // Swiped right - show previous
                showPrevImage();
            }
        }
    }

    // Add CSS animations for lightbox
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .lightbox-content {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }

        /* Loading spinner */
        .lightbox-content::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // ===== Gallery Filter (Optional Enhancement) =====
    // Uncomment to add category filtering to gallery

    /*
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    */

    // ===== Image Lazy Loading Enhancement =====
    const galleryImages = document.querySelectorAll('.gallery-item img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Add loading class
                    img.classList.add('loading');

                    // When image loads, remove loading class and add loaded class
                    img.onload = () => {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    };

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        galleryImages.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // ===== Gallery Image Counter =====
    function updateImageCounter() {
        if (!lightbox.classList.contains('active')) return;

        const counter = document.querySelector('.lightbox-counter') || createCounter();
        counter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    }

    function createCounter() {
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        counter.style.cssText = `
            position: absolute;
            top: 30px;
            left: 40px;
            color: white;
            font-size: 1.2rem;
            font-weight: 500;
            background: rgba(0,0,0,0.5);
            padding: 10px 20px;
            border-radius: 25px;
        `;
        lightbox.appendChild(counter);
        return counter;
    }

    // Update counter when image changes
    const originalUpdateImage = updateLightboxImage;
    updateLightboxImage = function() {
        originalUpdateImage();
        updateImageCounter();
    };

    // ===== Gallery Download Button (Optional) =====
    /*
    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = '⬇ Download';
    downloadBtn.className = 'lightbox-download';
    downloadBtn.style.cssText = `
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
    `;
    lightbox.appendChild(downloadBtn);

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = images[currentImageIndex].src;
        link.download = `baretto-${currentImageIndex + 1}.jpg`;
        link.click();
    });
    */

    // ===== Analytics Tracking =====
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            console.log(`Gallery image ${index + 1} opened`);
            // Add your analytics tracking here
            // Example: gtag('event', 'gallery_view', { image_index: index + 1 });
        });
    });

    // ===== Share Button (Optional Social Sharing) =====
    /*
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = '📤 Share';
    shareBtn.className = 'lightbox-share';
    shareBtn.style.cssText = `
        position: absolute;
        bottom: 80px;
        right: 50px;
        background: var(--secondary-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
    `;
    lightbox.appendChild(shareBtn);

    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'BARETTO Espressobar',
                    text: images[currentImageIndex].caption,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback: copy link to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    });
    */

    console.log('📸 Gallery initialized with', images.length, 'images');
});

// ===== Gallery Masonry Layout (Optional Enhancement) =====
// Uncomment for Pinterest-style masonry layout
/*
function initMasonryLayout() {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    // Calculate optimal column count based on screen width
    function getColumnCount() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }

    function layoutMasonry() {
        const columnCount = getColumnCount();
        const items = Array.from(gallery.children);
        const columnHeights = new Array(columnCount).fill(0);

        items.forEach((item, index) => {
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            const columnWidth = gallery.offsetWidth / columnCount;

            item.style.position = 'absolute';
            item.style.left = `${shortestColumn * columnWidth}px`;
            item.style.top = `${columnHeights[shortestColumn]}px`;
            item.style.width = `${columnWidth - 20}px`;

            columnHeights[shortestColumn] += item.offsetHeight + 20;
        });

        gallery.style.height = `${Math.max(...columnHeights)}px`;
        gallery.style.position = 'relative';
    }

    layoutMasonry();
    window.addEventListener('resize', layoutMasonry);
}

// Uncomment to enable:
// window.addEventListener('load', initMasonryLayout);
*/
