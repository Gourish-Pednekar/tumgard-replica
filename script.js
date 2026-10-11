/* =========================================================
   TUMGARD REPLICA — script.js
   ========================================================= */

/* 1. Accordion — global fn (called via onclick in HTML).
      Opens clicked item, closes all others. Does NOT swap the "+" symbol (matches original). */
function toggleAccordion(element) {
  var items = document.querySelectorAll('.new-accordion-item');
  items.forEach(function (item) {
    var header  = item.querySelector('.new-accordion-header');
    var content = item.querySelector('.new-accordion-content');
    if (header === element) {
      header.classList.toggle('active');
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    } else {
      header.classList.remove('active');
      content.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {

  /* 2. Hamburger menu (mobile) */
  var hi  = document.getElementById('hamburger-icon');
  var hc  = document.getElementById('hamburger-close');
  var nav = document.getElementById('hamburger-nav-menu');
  if (hi && hc && nav) {
    hi.addEventListener('click', function () { nav.style.left = '0'; });
    hc.addEventListener('click', function () { nav.style.left = '-100%'; });
  }

  /* 3. Pricing card selection -> updates button price, EMI and cart link.
        EMI = round(price / 3)  (1399 -> 466, 699 -> 233, 2397 -> 799) */
  var radios  = document.querySelectorAll('.product-variation-radio');
  var priceEl = document.getElementById('product-1-price');
  var emiEl   = document.getElementById('product-1-emi-price');
  var cartEl  = document.getElementById('product-1-link');
  radios.forEach(function (r) {
    r.addEventListener('change', function () {
      var p = parseInt(r.dataset.price, 10);
      priceEl.textContent = p;
      emiEl.textContent   = Math.round(p / 3);
      if (r.dataset.cart) cartEl.href = r.dataset.cart;   // options 2 & 3 cart URLs: see TODO in section 8
    });
  });

  /* 4. Add-to-cart loader (copied from original logic) */
  var btn = document.querySelector('.add-to-cart-btn');
  if (btn) {
    var resetBtn = function () { btn.classList.remove('loading'); btn.style.pointerEvents = 'auto'; };
    btn.addEventListener('click', function (e) {
      if (btn.classList.contains('loading')) { e.preventDefault(); return; }
      btn.classList.add('loading');
      btn.style.pointerEvents = 'none';
      setTimeout(resetBtn, 800);
    });
    window.addEventListener('pageshow', resetBtn);
  }

  /* 5. Testimonial videos: muted + autoplay + loop (original did $('video').each(muted=true; play())) */
  document.querySelectorAll('video').forEach(function (v) {
    v.muted = true;
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () {});
  });

  /* 5b. Mute icon click: toggles sound, state class, and supplied icon asset. */
  document.querySelectorAll('.video-wrapper').forEach(function (w) {
    var v = w.querySelector('video'), ic = w.querySelector('img');
    if (!v || !ic) return;
    ic.addEventListener('click', function () {
      v.muted = !v.muted;
      ic.classList.toggle('playing-muted', v.muted);
      ic.classList.toggle('playing-with-sound', !v.muted);
      ic.src = v.muted ? 'assets/muted-icon.svg' : 'assets/sounded-icon.svg';
    });
  });

  /* 6. "FREE delivery by" date (ASSUMPTION: today + 5 days; original showed "16 Oct" on 11 Oct) */
  var dEl = document.getElementById('estimated-Date');
  if (dEl) {
    var d = new Date(); d.setDate(d.getDate() + 5);
    var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    dEl.textContent = ' ' + d.getDate() + ' ' + M[d.getMonth()];
  }

  /* 7. Marquee: original has 6 identical groups of 9 items; clone to 6 total */
  document.querySelectorAll('.auto-scroll-section p').forEach(function (p) {
    var html = p.innerHTML;
    for (var i = 0; i < 5; i++) p.insertAdjacentHTML('beforeend', html);
  });

  /* 8. Sticky bottom bar: reveal once the testimonial section reaches the viewport,
        then keep it fixed at the bottom while the visitor continues scrolling. */
  var bar  = document.querySelector('.landing-sticky-button-section');
  var testimonials = document.querySelector('.testimonial-slider-section');
  function updateBar() {
    if (!bar || !testimonials) return;
    bar.classList.toggle('is-visible', testimonials.getBoundingClientRect().top <= 225);
  }
  if (bar) bar.style.display = 'block';
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();

  /* 9. Mobile gallery: Slick (same settings as original) */
  if (window.jQuery && jQuery.fn.slick) {
    jQuery('.product-gallery-slider').slick({
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true,
      prevArrow: '<button type="button" class="slick-prev"><img src="assets/slider-arrow-left.svg" alt=""></button>',
      nextArrow: '<button type="button" class="slick-next"><img src="assets/slider-arrow-right.svg" alt=""></button>',
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }]
    });
    window.addEventListener('resize', function () {
      jQuery('.product-gallery-slider').slick('setPosition');
    });
  }
});
