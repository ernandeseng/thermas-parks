// Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("promoModal");
    const btn = document.getElementById("promo-link");
    const span = document.getElementsByClassName("close-modal")[0];

    if (modal && btn && span) {
        btn.onclick = function (e) {
            e.preventDefault();
            modal.style.display = "block";
        }

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

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
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);

        if (!container || slides.length === 0) return;

        let currentIndex = 0;
        let slidesPerView = 3;

        function updateSlidesPerView() {
            if (window.innerWidth <= 600) slidesPerView = 1;
            else if (window.innerWidth <= 992) slidesPerView = 2; // Adjusted break point to match CSS
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

            // Ensure percentage is correct based on slides per view
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
                const totalSlides = slides.length; // Re-calculate or use variable
                if (currentIndex > 0) {
                    showSlide(currentIndex - 1);
                }
            });
        }

        // --- SWIPE FUNCTIONALITY ---
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;

        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX; // Use clientX for better consistency
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            handleSwipe(touchEndY);
        }, { passive: true });

        function handleSwipe(touchEndY) {
            // Check if vertical scroll was dominant
            const yDiff = Math.abs(touchStartY - touchEndY);
            const xDiff = Math.abs(touchStartX - touchEndX);

            if (yDiff > xDiff) return; // User was scrolling vertically, ignore swipe

            const threshold = 50;
            const totalSlides = slides.length;
            const maxIndex = Math.max(0, totalSlides - slidesPerView);

            if (touchEndX < touchStartX - threshold) {
                // Swiped Left -> Next
                if (currentIndex < maxIndex) {
                    showSlide(currentIndex + 1);
                } else {
                    showSlide(0); // loop
                }
            }
            if (touchEndX > touchStartX + threshold) {
                // Swiped Right -> Prev
                if (currentIndex > 0) {
                    showSlide(currentIndex - 1);
                }
            }
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

// Global function for WhatsApp form submission
function sendToWhatsappNew(e, form) {
    e.preventDefault();
    const nome = form.nome.value;
    const email = form.email.value;
    const telefone = form.telefone.value;
    const cidade = form.cidade.value;
    const checkin = form.checkin.value;
    const checkout = form.checkout.value;
    const adultos = form.adultos.value;
    const criancas7_12 = form.criancas7_12.value;
    const criancas0_6 = form.criancas0_6.value;
    const pensao = form.pensao.value;

    // Contato Pref: only WhatsApp now
    let contatoPref = 'WhatsApp';
    const prefInput = form.querySelector('input[name="contato_pref"]:checked');
    if (prefInput) contatoPref = prefInput.value;

    // Determine context (Hotel name or General Inquiry)
    let contextName = document.title;
    if (contextName.includes(" - ")) contextName = contextName.split(" - ")[0];

    // If on index or general page, maybe use a generic header
    const pageTitle = document.title;
    if (pageTitle.includes("Home") || pageTitle.includes("Guia Tour")) {
        contextName = "Guia Tour Thermas Parks";
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const checkinFormatted = formatDate(checkin);
    const checkoutFormatted = formatDate(checkout);

    const message = `Olá! Gostaria de conhecer as *promoções* do *${contextName}*.

*Nome:* ${nome}
*E-mail:* ${email}
*Telefone:* ${telefone}
*Cidade:* ${cidade}
*Check-in:* ${checkinFormatted}
*Check-out:* ${checkoutFormatted}
*Adultos:* ${adultos}
*Crianças (7-12):* ${criancas7_12}
*Crianças (0-6):* ${criancas0_6}
*Pensão:* ${pensao}
*Preferência de contato:* ${contatoPref}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/5517997858264?text=${encodedMessage}`;
    window.open(url, "_blank");
}