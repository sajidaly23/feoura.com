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

// Slider Functionality - Continuous Right to Left Scroll
const slider = document.getElementById('slider');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');

if (slider && prevButton && nextButton) {
    let currentSlide = 0;
    const slides = slider.children;
    const totalSlides = slides.length;
    let slideWidth = 0;
    
    // Calculate slide width based on viewport
    function calculateSlideWidth() {
        if (window.innerWidth >= 1024) {
            slideWidth = 20; // 20% on desktop (shows 5 images)
        } else {
            slideWidth = 50; // 50% on mobile (shows 2 images)
        }
    }
    
    calculateSlideWidth();
    window.addEventListener('resize', calculateSlideWidth);

    // Function to update slider position
    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    }

    // Auto-scroll from right to left
    function autoScroll() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
        
        // Reset to beginning for infinite loop
        if (currentSlide === 0) {
            setTimeout(() => {
                slider.style.transition = 'none';
                slider.style.transform = 'translateX(0)';
                setTimeout(() => {
                    slider.style.transition = 'transform 1000ms ease-in-out';
                }, 50);
            }, 1000);
        }
    }

    // Start auto-scroll (every 4 seconds)
    let autoScrollInterval = setInterval(autoScroll, 4000);

    // Manual navigation
    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
        // Reset auto-scroll timer
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(autoScroll, 4000);
    });

    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
        // Reset auto-scroll timer
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(autoScroll, 4000);
    });

    // Pause on hover
    const sliderContainer = slider.closest('.overflow-hidden');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
        sliderContainer.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(autoScroll, 4000);
        });
    }
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
