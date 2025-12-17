document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Scroll Header & Scroll Top Button
    const header = document.querySelector('#header');
    const scrollTopBtn = document.querySelector('.scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }

        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (hamburger) {
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // Scroll Animation (Reveal on Scroll)
    const revealElements = document.querySelectorAll('.card, .section-header, .newsletter-content');

    // Add initial state class via JS to avoid layout shift if JS fails
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1
    });

    // Generic Carousel Logic
    function initCarousel(wrapperSelector, prevBtnSelector, nextBtnSelector) {
        const wrapper = document.querySelector(wrapperSelector);
        if (!wrapper) return;

        const container = wrapper.querySelector('.carousel-container');
        const slides = wrapper.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector(prevBtnSelector); // Select globally to allow external buttons
        const nextBtn = document.querySelector(nextBtnSelector);

        if (!container || slides.length === 0) return;

        let currentIndex = 0;
        let slidesPerView = 3;

        function updateSlidesPerView() {
            if (window.innerWidth <= 600) slidesPerView = 1;
            else if (window.innerWidth <= 900) slidesPerView = 2;
            else slidesPerView = 3;
        }

        window.addEventListener('resize', () => {
            updateSlidesPerView();
            showSlide(currentIndex);
        });

        updateSlidesPerView();

        function showSlide(index) {
            const totalSlides = slides.length;
            const maxIndex = Math.max(0, totalSlides - slidesPerView);

            if (index > maxIndex) index = maxIndex;
            if (index < 0) index = 0;

            currentIndex = index;

            const offset = -(currentIndex * (100 / slidesPerView));
            container.style.transform = `translateX(${offset}%)`;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalSlides = slides.length;
                const maxIndex = Math.max(0, totalSlides - slidesPerView);

                if (currentIndex < maxIndex) {
                    showSlide(currentIndex + 1);
                } else {
                    showSlide(0);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const totalSlides = slides.length; // Re-calculate in case of dynamic changes
                if (currentIndex > 0) {
                    showSlide(currentIndex - 1);
                } else {
                    // Optional loop back to end? The original didn't loop back on prev
                    // Let's keep it simple or matches nextBtn loop logic? 
                    // NextBtn loops to 0. Should PrevBtn loop to max?
                    // Original code: if (currentIndex > 0) showSlide(currentIndex - 1); -> No loop.
                }
            });
        }
    }

    // Initialize Park Carousel
    initCarousel('#parques .carousel-wrapper', '#parques .park-prev', '#parques .park-next');

    // Initialize Hosting Carousel
    initCarousel('#hospedagem .carousel-wrapper', '#hospedagem .park-prev', '#hospedagem .park-next');

    // Hero Carousel Logic
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrevBtn = document.querySelector('#hero-prev');
    const heroNextBtn = document.querySelector('#hero-next');
    let currentHeroIndex = 0;
    const heroIntervalTime = 5000; // 5 seconds
    let heroInterval;

    function showHeroSlide(index) {
        // Handle wrapping
        if (index >= heroSlides.length) index = 0;
        if (index < 0) index = heroSlides.length - 1;

        // Remove active class from all
        heroSlides.forEach(slide => slide.classList.remove('active'));

        // Add active class to new slide
        heroSlides[index].classList.add('active');

        currentHeroIndex = index;
    }

    function nextHeroSlide() {
        showHeroSlide(currentHeroIndex + 1);
    }

    function prevHeroSlide() {
        showHeroSlide(currentHeroIndex - 1);
    }

    function startHeroAutoPlay() {
        heroInterval = setInterval(nextHeroSlide, heroIntervalTime);
    }

    function resetHeroAutoPlay() {
        clearInterval(heroInterval);
        startHeroAutoPlay();
    }

    if (heroSlides.length > 0) {
        if (heroNextBtn) {
            heroNextBtn.addEventListener('click', () => {
                nextHeroSlide();
                resetHeroAutoPlay();
            });
        }

        if (heroPrevBtn) {
            heroPrevBtn.addEventListener('click', () => {
                prevHeroSlide();
                resetHeroAutoPlay();
            });
        }

        startHeroAutoPlay();
    }

    revealElements.forEach(el => revealObserver.observe(el));
});
