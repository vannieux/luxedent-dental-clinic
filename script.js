document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'shadow-sm');
            navbar.classList.remove('bg-transparent', 'py-5');
            navbar.classList.add('py-3');
        } else {
            navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
            navbar.classList.add('bg-transparent', 'py-5');
        }
    });

    /* --- 2. Mobile Menu Toggle --- */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            // Small delay to allow display block to apply before animating opacity
            setTimeout(() => {
                mobileMenu.classList.remove('opacity-0');
            }, 10);
            document.body.style.overflow = 'hidden';
            
            // Transform hamburger to X
            menuBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        } else {
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            document.body.style.overflow = '';
            
            // Revert X to hamburger
            menuBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    /* --- 3. Scroll Reveal Animation --- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    /* --- 4. Counter Animation --- */
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = counter.getAttribute('data-decimal') === 'true';
                const duration = 2000; // 2 seconds
                const frameDuration = 1000 / 60;
                const totalFrames = Math.round(duration / frameDuration);
                let frame = 0;
                
                const easeOutQuad = t => t * (2 - t);

                const count = setInterval(() => {
                    frame++;
                    const progress = easeOutQuad(frame / totalFrames);
                    const currentCount = target * progress;

                    if (isDecimal) {
                        counter.innerText = currentCount.toFixed(1);
                    } else {
                        counter.innerText = Math.floor(currentCount);
                    }

                    if (frame === totalFrames) {
                        clearInterval(count);
                        counter.innerText = isDecimal ? target.toFixed(1) : target;
                    }
                }, frameDuration);
            });
        }
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        // Observe the parent container of the counters
        counterObserver.observe(counters[0].parentElement.parentElement);
    }

    /* --- 5. Testimonial Carousel --- */
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        let cardWidth = track.children[0].getBoundingClientRect().width;
        let gap = parseInt(window.getComputedStyle(track).gap) || 24; // Tailwind gap-6 is 24px
        
        // Recalculate on resize
        window.addEventListener('resize', () => {
            cardWidth = track.children[0].getBoundingClientRect().width;
            updateCarousel();
        });

        function updateCarousel() {
            const amountToMove = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${amountToMove}px)`;
        }

        nextBtn.addEventListener('click', () => {
            const visibleCards = window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 768 ? 2 : 1);
            const maxIndex = track.children.length - visibleCards;
            
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
    }

    /* --- 6. FAQ Accordion --- */
    const faqBtns = document.querySelectorAll('.faq-btn');
    
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('svg');
            
            // Toggle current
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
                btn.classList.add('text-brand-600');
            } else {
                content.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
                btn.classList.remove('text-brand-600');
            }
        });
    });

});