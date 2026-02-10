// Main JavaScript file
import './input.css'

// Mobile Menu Toggle Functionality
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');

        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });
}

// Chat Widget Toggle Functionality
const chatButton = document.getElementById('chatButton');
const chatWidget = document.getElementById('chatWidget');
const closeChat = document.getElementById('closeChat');

if (chatButton && chatWidget) {
    chatButton.addEventListener('click', () => {
        if (chatWidget.classList.contains('hidden')) {
            chatWidget.classList.remove('hidden');
            // Trigger animation
            setTimeout(() => {
                chatWidget.classList.remove('opacity-0', 'translate-y-4');
                chatWidget.classList.add('opacity-100', 'translate-y-0');
            }, 10);
        } else {
            closeChatWidget();
        }
    });
}

if (closeChat) {
    closeChat.addEventListener('click', () => {
        closeChatWidget();
    });
}

function closeChatWidget() {
    chatWidget.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => {
        chatWidget.classList.add('hidden');
    }, 300);
}

// Slider Functionality - Infinite Loop
const slider = document.getElementById('slider');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');

if (slider && prevButton && nextButton) {
    const originalSlides = Array.from(slider.children);
    const totalOriginalSlides = originalSlides.length;

    // We need to clone slides to create the illusion of infinite scrolling.
    // Cloning all slides is usually safest for small numbers of slides.
    originalSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true'); // Accessibility
        slider.appendChild(clone);
    });

    let currentIndex = 0;
    let isTransitioning = false;

    // Get gap from CSS
    const getGap = () => {
        const style = window.getComputedStyle(slider);
        const gap = parseFloat(style.gap) || 0;
        return gap;
    };

    const updateSliderPosition = (withTransition = true) => {
        if (!slider.children.length) return;

        const firstSlide = slider.children[0];
        const slideWidth = firstSlide.offsetWidth;
        const gap = getGap();
        const moveAmount = (slideWidth + gap) * currentIndex;

        if (!withTransition) {
            slider.style.transition = 'none';
        } else {
            slider.style.transition = 'transform 0.5s ease-in-out';
        }

        slider.style.transform = `translateX(-${moveAmount}px)`;

        // Reflow to ensure transition removal takes effect immediately if needed
        if (!withTransition) slider.offsetHeight;
    };

    const handleTransitionEnd = () => {
        isTransitioning = false;

        // Forward loop: If we've scrolled past the original set (pointing to clones)
        if (currentIndex >= totalOriginalSlides) {
            currentIndex = currentIndex % totalOriginalSlides;
            updateSliderPosition(false);
        }
    };

    slider.addEventListener('transitionend', handleTransitionEnd);

    const nextSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateSliderPosition(true);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (currentIndex === 0) {
            // Jump to the end of the cloned set (which matches the start visually)
            // Actually, we want to jump to the 'clone' matching the last original slide?
            // No, if we are at 0 (Original 1), 'backward' should be 'Original Last'.
            // In our cloning setup: [1, 2, 1', 2']
            // 0 is 1. Back from 0 should go to 2' (index 3) ??? No, visual continuity.
            // Behave as if we are at 1' (index 2).
            // Jump to 2 (1').
            // Then animate to 1 (2).

            currentIndex = totalOriginalSlides;
            updateSliderPosition(false);

            // Force reflow/next frame to allow jump to happen before animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    currentIndex--;
                    updateSliderPosition(true);
                });
            });
        } else {
            currentIndex--;
            updateSliderPosition(true);
        }
    };

    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoScroll();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoScroll();
    });

    // Auto Scroll
    let autoScrollInterval;

    const startAutoScroll = () => {
        autoScrollInterval = setInterval(nextSlide, 3000);
    };

    const resetAutoScroll = () => {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    };

    startAutoScroll();

    // Pause on hover
    slider.parentElement.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    slider.parentElement.addEventListener('mouseleave', startAutoScroll);

    // Handle Resize
    window.addEventListener('resize', () => {
        updateSliderPosition(false);
    });
}

// Navigation Functionality
const navLinks = document.querySelectorAll('.nav-link');
const homePage = document.getElementById('home-page');
const websiteDesignPage = document.getElementById('website-design-page');
const partnersSection = document.getElementById('partners-section');
const allSections = document.querySelectorAll('section');

function showPage(pageName) {
    // Hide all pages
    if (homePage) homePage.classList.add('hidden');
    if (websiteDesignPage) websiteDesignPage.classList.add('hidden');

    // Hide all other sections when showing a specific page (except footer and chat widget)
    allSections.forEach(section => {
        const sectionId = section.id || '';
        const isFooter = section.closest('footer') !== null;
        const isChatWidget = sectionId.includes('chat');

        if (sectionId !== 'website-design-page' && !isFooter && !isChatWidget) {
            section.classList.add('hidden');
        }
    });

    // Show the requested page
    if (pageName === 'home') {
        if (homePage) homePage.classList.remove('hidden');
        // Show all sections for home page (except website design page)
        allSections.forEach(section => {
            const sectionId = section.id || '';
            if (sectionId !== 'website-design-page') {
                section.classList.remove('hidden');
            }
        });
    } else if (pageName === 'website-design') {
        if (websiteDesignPage) websiteDesignPage.classList.remove('hidden');
    }

    // Close mobile menu if open
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (menuIcon) menuIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add click event listeners to navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) {
            showPage(page);
        }
    });
});
