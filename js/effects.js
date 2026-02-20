/* ============================================
   Visual Effects Module
   Scroll reveals, counters, card tilt, etc.
   ============================================ */

const Effects = (function () {
    'use strict';

    // --- Scroll Reveal with IntersectionObserver ---
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stagger children if the element has .reveal-stagger
                    if (entry.target.classList.contains('reveal-stagger')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, i) => {
                            child.style.transitionDelay = (i * 80) + 'ms';
                            child.classList.add('revealed');
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        // Observe all revealable elements
        document.querySelectorAll('.reveal-on-scroll, .reveal-stagger').forEach(el => {
            observer.observe(el);
        });
    }

    // Re-observe after dynamic content renders
    function refreshScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    if (entry.target.classList.contains('reveal-stagger')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, i) => {
                            child.style.transitionDelay = (i * 80) + 'ms';
                            child.classList.add('revealed');
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.reveal-on-scroll:not(.revealed), .reveal-stagger:not(.revealed)').forEach(el => {
            observer.observe(el);
        });
    }

    // --- Animated Number Counters ---
    function animateCounters() {
        document.querySelectorAll('.counter-animate').forEach(el => {
            const target = parseInt(el.textContent, 10);
            if (isNaN(target)) return;

            const duration = 1200;
            const start = performance.now();
            el.textContent = '0';

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    // --- 3D Card Tilt Effect ---
    function initCardTilt() {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.tilt-card:hover');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            });
        });

        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList && e.target.classList.contains('tilt-card')) {
                e.target.style.transform = '';
            }
        }, true);

        // Reset on mouse leave from cards
        document.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.tilt-card');
            if (card && !card.contains(e.relatedTarget)) {
                card.style.transform = '';
            }
        });
    }

    // --- Back to Top Button ---
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
        document.body.appendChild(btn);

        let visible = false;
        window.addEventListener('scroll', () => {
            const shouldShow = window.scrollY > 400;
            if (shouldShow !== visible) {
                visible = shouldShow;
                btn.classList.toggle('visible', visible);
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Init ---
    function init() {
        initScrollReveal();
        initCardTilt();
        initBackToTop();
    }

    return { init, animateCounters, refreshScrollReveal };
})();
