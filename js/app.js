(function () {
  const STORAGE_KEY = 'whaletag-theme';
  const ICON_LIGHT = '☀️';
  const ICON_DARK = '🌙';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach((btn) => {
      btn.textContent = theme === 'dark' ? ICON_LIGHT : ICON_DARK;
      btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
      btn.setAttribute('title', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    });
  }

  function initTheme() {
    const stored = getStoredTheme();
    const theme = stored || getSystemTheme();
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setStoredTheme(next);
    applyTheme(next);
  }

  // Initialize as early as possible (also duplicated inline in HTML head to avoid FOUC)
  initTheme();

  // Bind toggle buttons once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach((btn) => btn.addEventListener('click', toggleTheme));

    // Listen for system theme changes when no manual preference is stored
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');

    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });

      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Homepage screenshot carousel
    initCarousels();
  });

  function initCarousels() {
    document.querySelectorAll('.carousel').forEach((carousel) => {
      const track = carousel.querySelector('.carousel-track');
      const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');
      const dots = Array.from(carousel.querySelectorAll('.carousel-dots button'));
      const count = slides.length;
      if (count <= 1) return;

      let current = 0;
      let autoplayTimer = null;
      const autoplay = carousel.dataset.autoplay === 'true';
      const interval = parseInt(carousel.dataset.interval, 10) || 5000;

      function goTo(index, direction = 0) {
        let next = index;
        if (next < 0) next = count - 1;
        if (next >= count) next = 0;
        current = next;

        track.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === current);
          slide.setAttribute('aria-label', `${i + 1} / ${count}`);
        });

        dots.forEach((dot, i) => {
          const selected = i === current;
          dot.setAttribute('aria-selected', String(selected));
          dot.setAttribute('tabindex', selected ? '0' : '-1');
        });
      }

      function next() {
        goTo(current + 1, 1);
      }

      function prev() {
        goTo(current - 1, -1);
      }

      function startAutoplay() {
        if (!autoplay) return;
        stopAutoplay();
        autoplayTimer = setInterval(next, interval);
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      prevBtn.addEventListener('click', () => {
        prev();
        startAutoplay();
      });

      nextBtn.addEventListener('click', () => {
        next();
        startAutoplay();
      });

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goTo(i);
          startAutoplay();
        });
      });

      // Keyboard navigation
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prev();
          startAutoplay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          next();
          startAutoplay();
        }
      });

      // Touch / mouse drag swipe
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      let startTranslate = 0;

      function pointerDown(x) {
        startX = x;
        currentX = x;
        isDragging = true;
        carousel.classList.add('is-dragging');
        stopAutoplay();
        const matrix = new DOMMatrix(getComputedStyle(track).transform);
        startTranslate = matrix.m41;
      }

      function pointerMove(x) {
        if (!isDragging) return;
        currentX = x;
        const delta = x - startX;
        track.style.transform = `translateX(${startTranslate + delta}px)`;
      }

      function pointerUp() {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('is-dragging');
        const delta = currentX - startX;
        const threshold = carousel.offsetWidth * 0.15;
        if (delta < -threshold) {
          next();
        } else if (delta > threshold) {
          prev();
        } else {
          goTo(current);
        }
        startAutoplay();
      }

      carousel.addEventListener('touchstart', (e) => {
        pointerDown(e.touches[0].clientX);
      }, { passive: true });

      carousel.addEventListener('touchmove', (e) => {
        pointerMove(e.touches[0].clientX);
      }, { passive: true });

      carousel.addEventListener('touchend', pointerUp);
      carousel.addEventListener('touchcancel', pointerUp);

      carousel.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        pointerDown(e.clientX);
      });

      window.addEventListener('mousemove', (e) => {
        pointerMove(e.clientX);
      });

      window.addEventListener('mouseup', pointerUp);

      // Pause autoplay when tab is hidden
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });

      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);

      goTo(0);
      startAutoplay();
    });
  }
})();
