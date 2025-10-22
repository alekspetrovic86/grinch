import $ from 'jquery';
import * as bootstrap from 'bootstrap';
import GLightbox from 'glightbox';

// --------------------------------------------------------------------
// STICKY HEADER BLUR
// --------------------------------------------------------------------
(function () {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;
    const THRESHOLD = 10;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY > THRESHOLD;
            header.classList.toggle('header--scrolled', scrolled);
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
})();

// --------------------------------------------------------------------
// Close navigation on mobile on click menu item
// --------------------------------------------------------------------
document.querySelectorAll('.header__offcanvas .header__link').forEach(link => {
    link.addEventListener('click', () => {
        const offcanvasEl = document.getElementById('headerOffcanvas');
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) {
            offcanvas.hide();
        }
    });
});

// --------------------------------------------------------------------
// HERO SWIPER
// --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const sliderEl = document.querySelector('#section-hero-swiper');
    if (!sliderEl) return;
    const root = sliderEl.closest('.hero');
    const currentEl = root.querySelector('.hero__counter--current');
    const totalEl = root.querySelector('.hero__counter--total');
    const barEl = root.querySelector('.hero__progress-bar');

    const getTotal = () => sliderEl.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length;

    const pad2 = (n) => String(n).padStart(2, '0');
    const setBar = (idx, total) => {
        const pct = (idx / total) * 100;
        barEl.style.width = pct + '%';
    };

    const heroSwiper = new Swiper(sliderEl, {
        slidesPerView: 1,
        loop: true,
        speed: 900,
        autoplay: { delay: 5000, disableOnInteraction: false },
        allowTouchMove: true,
        on: {
            init(sw) {
                const total = getTotal();
                totalEl.textContent = pad2(total);
                const current = sw.realIndex + 1;
                currentEl.textContent = pad2(current);
                setBar(current, total);
            },
            slideChange(sw) {
                const total = getTotal();
                const current = sw.realIndex + 1;
                currentEl.textContent = pad2(current);
                setBar(current, total);
            },
        },
    });
});

// --------------------------------------------------------------------
// ROOMS SWIPER
// --------------------------------------------------------------------
// document.addEventListener('DOMContentLoaded', () => {
//     const sections = document.querySelectorAll('.section-room');

//     sections.forEach(section => {
//         const roomEl = section.querySelector('.room__slider') || section.querySelector('.swiper');
//         if (!roomEl) return;

//         const tabsEl = section.querySelector('.room__tabs') || section.querySelector('.swiper-pagination');
//         const vbarEl = section.querySelector('.room__vbar');
//         const hbarEl = section.querySelector('.room__hbar');

//         let labels = [];
//         try {
//             const raw = roomEl.dataset.roomLabels;
//             if (raw) {
//                 const parsed = JSON.parse(raw);
//                 if (Array.isArray(parsed)) labels = parsed;
//             }
//         } catch (err) {
//             labels = [];
//         }

//         const slideEls = roomEl.querySelectorAll('.swiper-slide');
//         if (!labels.length) {
//             labels = Array.from(slideEls).map((sl, i) => {
//                 const titleEl = sl.querySelector('.room__title');
//                 return titleEl ? titleEl.textContent.trim() : `Slide ${i + 1}`;
//             });
//         }

//         const total = Math.max(labels.length, slideEls.length, 1);

//         const setProgress = (activeIndex) => {
//             const pct = total > 0 ? ((activeIndex + 1) / total) * 100 : 0;
//             if (vbarEl) vbarEl.style.height = pct + '%';
//             if (hbarEl) hbarEl.style.width = pct + '%';
//         };

//         // === detect mobile ===
//         const isMobile = window.matchMedia('(max-width: 991px)').matches;

//         let paginationConfig;
//         if (isMobile) {
//             // Mobile: arrows + single label
//             const wrapper = document.createElement('div');
//             wrapper.classList.add('room__mobile-nav');

//             const prevBtn = document.createElement('button');
//             prevBtn.className = 'room__nav-btn room__nav-btn--prev';
//             prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';

//             const labelSpan = document.createElement('span');
//             labelSpan.className = 'room__nav-label';
//             labelSpan.textContent = labels[0] || '';

//             const nextBtn = document.createElement('button');
//             nextBtn.className = 'room__nav-btn room__nav-btn--next';
//             nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';

//             wrapper.append(prevBtn, labelSpan, nextBtn);
//             tabsEl.replaceWith(wrapper);

//             paginationConfig = false; // disable default pagination

//             // We'll manually update the label later
//             roomEl.dataset.navLabelEl = labelSpan;
//             roomEl.dataset.prevBtnEl = prevBtn;
//             roomEl.dataset.nextBtnEl = nextBtn;
//         } else {
//             // Desktop: regular bullets with labels
//             paginationConfig = {
//                 el: tabsEl || undefined,
//                 clickable: true,
//                 renderBullet: (index, className) => `<span class="${className}">${labels[index] || `Slide ${index + 1}`}</span>`,
//             };
//         }

//         const sw = new Swiper(roomEl, {
//             slidesPerView: 1,
//             loop: false,
//             speed: parseInt(roomEl.dataset.speed, 10) || 600,
//             autoHeight: true,
//             spaceBetween: parseInt(roomEl.dataset.spaceBetween, 10) || 100,
//             observer: true,
//             observeParents: true,
//             pagination: paginationConfig,
//             on: {
//                 init(s) {
//                     setProgress(s.activeIndex);
//                     if (isMobile) {
//                         const labelEl = section.querySelector('.room__nav-label');
//                         if (labelEl) labelEl.textContent = labels[s.activeIndex] || '';
//                     }
//                 },
//                 slideChange(s) {
//                     setProgress(s.activeIndex);
//                     if (isMobile) {
//                         const labelEl = section.querySelector('.room__nav-label');
//                         if (labelEl) labelEl.textContent = labels[s.activeIndex] || '';
//                     }
//                 },
//             },
//         });

//         if (isMobile) {
//             const prevBtn = section.querySelector('.room__nav-btn--prev');
//             const nextBtn = section.querySelector('.room__nav-btn--next');
//             prevBtn.addEventListener('click', () => sw.slidePrev());
//             nextBtn.addEventListener('click', () => sw.slideNext());
//         }

//         setProgress(sw.activeIndex);
//     });
// });


// --------------------------------------------------------------------
// COMFORTS SWIPER
// --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const comfortSections = document.querySelectorAll('.section-comforts');

    comfortSections.forEach(section => {
        const swiperEl = section.querySelector('.comforts__slider.swiper');
        if (!swiperEl) return;

        const nextBtn = section.querySelector('.comforts__next');
        const prevBtn = section.querySelector('.comforts__prev');

        new Swiper(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,
        navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
        },
        breakpoints: {
            576: { slidesPerView: 2, spaceBetween: 20 },
            992: { slidesPerView: 4, spaceBetween: 26 },
        },
        });
    });
});

// --------------------------------------------------------------------
// GALLERY SWIPER + LIGHTBOX
// --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const gallerySections = document.querySelectorAll('.section-gallery');

    gallerySections.forEach(section => {
        const swiperEl = section.querySelector('.gallery__slider.swiper');
        if (!swiperEl) return;

        const nextBtn = section.querySelector('.gallery__next');
        const prevBtn = section.querySelector('.gallery__prev');
        const lightboxSelector = section.querySelectorAll('.gallery__lightbox').length
        ? `.gallery__lightbox[data-gallery="${section.id || 'gallery'}"]`
        : null;

        // Initialize Lightbox (per section)
        if (typeof GLightbox === 'function' && lightboxSelector) {
        GLightbox({
            selector: lightboxSelector,
        });
        }

        // Initialize Swiper (per section)
        new Swiper(swiperEl, {
        speed: 600,
        spaceBetween: 16,
        slidesPerView: 1,
        navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
        },
        breakpoints: {
            576: {
            slidesPerView: 2,
            grid: { rows: 2, fill: 'row' },
            spaceBetween: 16,
            },
            992: {
            slidesPerView: 3,
            grid: { rows: 2, fill: 'row' },
            spaceBetween: 24,
            },
        },
        });
    });
});


// --------------------------------------------------------------------
// FLOORPLANS
// --------------------------------------------------------------------
// document.querySelectorAll('[data-ytembed]').forEach((box) => {
//     const id = box.getAttribute('data-video-id');
//     const title = box.getAttribute('data-title') || 'Video';
//     const btn = box.querySelector('.floorplans__play');

//     const makeIframe = () => {
//         const url = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`;
//         const iframe = document.createElement('iframe');
//         iframe.src = url;
//         iframe.title = title;
//         iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
//         iframe.allowFullscreen = true;
//         return iframe;
//     };

//     btn.addEventListener('click', () => {
//         box.classList.add('is-playing');
//         box.innerHTML = '';
//         box.appendChild(makeIframe());
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
  const videoBoxes = document.querySelectorAll('[data-video]');

  videoBoxes.forEach(box => {
    const video = box.querySelector('video');
    const btn = box.querySelector('.floorplans__play');
    const poster = box.querySelector('.floorplans__poster');

    // Guard: make sure video + button exist
    if (!video || !btn) return;

    btn.addEventListener('click', () => {
      // If another video is playing, pause it
      document.querySelectorAll('[data-video].is-playing').forEach(other => {
        if (other !== box) {
          const otherVideo = other.querySelector('video');
          const otherBtn = other.querySelector('.floorplans__play');
          const otherPoster = other.querySelector('.floorplans__poster');
          other.classList.remove('is-playing');
          if (otherVideo) otherVideo.pause();
          if (otherBtn) otherBtn.style.display = '';
          if (otherPoster) otherPoster.style.display = '';
        }
      });

      // Play the current video
      box.classList.add('is-playing');
      btn.style.display = 'none';
      if (poster) poster.style.display = 'none';
      video.play();
    });

    // When video ends, restore button/poster
    video.addEventListener('ended', () => {
      box.classList.remove('is-playing');
      btn.style.display = '';
      if (poster) poster.style.display = '';
    });
  });
});
