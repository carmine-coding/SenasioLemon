/* ============================================================
   SENASIO LEMON — main.js
   Features:
   - Header scroll state
   - Mobile drawer open/close
   - GSAP ScrollTrigger reveal animations
   - Marquee pause-on-hover
   - Showcase strip drag scroll
   - FAQ accordion
   - Contact form mock submit
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     UTILS
  ---------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ----------------------------------------------------------
     HEADER — scroll state
  ---------------------------------------------------------- */
  const header = $('#site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     MOBILE DRAWER
  ---------------------------------------------------------- */
  const hamburger     = $('#hamburger');
  const drawer        = $('#mobile-drawer');
  const drawerClose   = $('#drawer-close');
  const drawerOverlay = $('#drawer-overlay');

  function openDrawer() {
    drawer && drawer.classList.add('open');
    hamburger && hamburger.classList.add('open');
    drawerOverlay && drawerOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer && drawer.classList.remove('open');
    hamburger && hamburger.classList.remove('open');
    drawerOverlay && drawerOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger     && hamburger.addEventListener('click', openDrawer);
  drawerClose   && drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay && drawerOverlay.addEventListener('click', closeDrawer);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close drawer when nav link clicked
  $$('.drawer-link').forEach((link) => link.addEventListener('click', closeDrawer));

  /* ----------------------------------------------------------
     GSAP REVEAL ANIMATIONS (requires GSAP + ScrollTrigger)
  ---------------------------------------------------------- */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Default ease
    const ease = 'power3.out';

    // .reveal-up
    $$('.reveal-up').forEach((el) => {
      const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
      gsap.fromTo(
        el,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // .reveal-left
    $$('.reveal-left').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -56 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // .reveal-right
    $$('.reveal-right').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 56 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Hero content entrance
    const heroContent = $('.hero-content');
    if (heroContent) {
      const children = Array.from(heroContent.children);
      gsap.fromTo(
        children,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease,
          delay: 0.3,
        }
      );
    }

    // Hero badge
    const badge = $('.hero-logo-badge');
    if (badge) {
      gsap.fromTo(
        badge,
        { opacity: 0, scale: 0.75 },
        { opacity: 0.75, scale: 1, duration: 1.1, ease: 'back.out(1.4)', delay: 1 }
      );
    }

    // Scroll hint
    const scrollHint = $('.hero-scroll-hint');
    if (scrollHint) {
      gsap.fromTo(
        scrollHint,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 1.5 }
      );
    }
  }

  // If GSAP not yet loaded, wait
  if (typeof gsap !== 'undefined') {
    initGSAP();
  } else {
    window.addEventListener('load', initGSAP);
  }

  /* ----------------------------------------------------------
     MARQUEE — pause on hover
  ---------------------------------------------------------- */
  const marqueeTrack = $('.marquee-track');
  if (marqueeTrack) {
    const strip = marqueeTrack.closest('.marquee-strip');
    if (strip) {
      strip.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
      });
      strip.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
      });
    }
  }

  /* ----------------------------------------------------------
     SHOWCASE STRIP — mouse drag scroll
  ---------------------------------------------------------- */
  const showcaseStrip = $('.showcase-strip');
  const showcaseTrack = $('#showcase-track');

  if (showcaseStrip && showcaseTrack) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    showcaseStrip.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - showcaseStrip.offsetLeft;
      scrollLeft = showcaseStrip.scrollLeft;
    });

    showcaseStrip.addEventListener('mouseleave', () => { isDown = false; });
    showcaseStrip.addEventListener('mouseup', () => { isDown = false; });

    showcaseStrip.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - showcaseStrip.offsetLeft;
      const walk = (x - startX) * 1.4;
      showcaseStrip.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;

    showcaseStrip.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = showcaseStrip.scrollLeft;
    }, { passive: true });

    showcaseStrip.addEventListener('touchmove', (e) => {
      const diff = touchStartX - e.touches[0].pageX;
      showcaseStrip.scrollLeft = touchScrollLeft + diff;
    }, { passive: true });

    // Enable horizontal scroll on the strip itself
    showcaseStrip.style.overflowX = 'auto';
    showcaseStrip.style.scrollbarWidth = 'none';
    showcaseStrip.style.msOverflowStyle = 'none';
  }

  /* ----------------------------------------------------------
     FAQ ACCORDION
  ---------------------------------------------------------- */
  $$('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const isOpen  = item.classList.contains('open');

      // Close all
      $$('.faq-item.open').forEach((openItem) => openItem.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ----------------------------------------------------------
     CONTACT FORM — mock submit with success state
  ---------------------------------------------------------- */
  function initForms() {
    $$('.contact-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const wrap = form.closest('.contact-form-wrap');
        const success = wrap ? wrap.querySelector('#form-success') : null;

        // Animate button state
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          const original = btn.textContent;
          btn.textContent = 'Invio in corso…';
          btn.disabled = true;

          setTimeout(() => {
            if (success) {
              form.style.display = 'none';
              success.style.display = 'block';

              // Animate the success icon with GSAP if available
              if (typeof gsap !== 'undefined') {
                gsap.fromTo(
                  success,
                  { opacity: 0, y: 24 },
                  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                );
              }
            } else {
              btn.textContent = 'Inviato ✓';
              setTimeout(() => {
                btn.textContent = original;
                btn.disabled = false;
                form.reset();
              }, 3000);
            }
          }, 900);
        }
      });
    });
  }
  initForms();

  /* ----------------------------------------------------------
     handleForm — global alias called inline in some HTML
  ---------------------------------------------------------- */
  window.handleForm = function (e) {
    e.preventDefault();
    const form    = e.target;
    const wrap    = form.closest('.contact-form-wrap');
    const success = document.getElementById('form-success');
    const btn     = form.querySelector('button[type="submit"]');

    if (btn) {
      btn.textContent = 'Invio in corso…';
      btn.disabled = true;
    }

    setTimeout(() => {
      if (success) {
        form.style.display = 'none';
        success.style.display = 'block';

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(
            success,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
        }
      }
    }, 900);
  };

  /* ----------------------------------------------------------
     ACTIVE NAV LINK — highlight based on current page
  ---------------------------------------------------------- */
  (function highlightNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === page) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

  /* ----------------------------------------------------------
     SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY;
        const headerH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h')
        ) || 74;
        window.scrollTo({ top: top - headerH - 16, behavior: 'smooth' });
      }
    });
  });

})();
