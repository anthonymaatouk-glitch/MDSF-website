/* Michel Daher Foundation — Version A (Circle) · behaviour */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = 'assets/img/';

  /* ---------- Images: resolve data-img, graceful placeholder if missing ---------- */
  function loadImg(img) {
    img.addEventListener('error', () => {
      if (img.dataset.fallback) {
        const s = document.createElement('span');
        s.className = 'logo-text'; s.textContent = img.dataset.fallback;
        img.replaceWith(s);
      } else img.classList.add('ph');
    }, { once: true });
    img.src = IMG + img.dataset.img;
  }
  $$('img[data-img]').forEach(loadImg);

  /* ---------- Social icons (shared by header + mobile panel) ---------- */
  const icons = [
    ['Facebook', '<svg viewBox="0 0 24 24" fill="#fff"><path d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.8v3h2.6V21z"/></svg>'],
    ['Instagram', '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6" fill="#fff"/></svg>'],
    ['LinkedIn', '<svg viewBox="0 0 24 24" fill="#fff"><rect x="5" y="9.5" width="3" height="9.5"/><circle cx="6.5" cy="6.3" r="1.8"/><path d="M10.5 9.5h2.9v1.3c.5-.8 1.5-1.5 3-1.5 2.6 0 3.1 1.7 3.1 3.9V19h-3v-5.1c0-1.2 0-2.4-1.5-2.4s-1.6 1.1-1.6 2.3V19h-2.9z"/></svg>'],
    ['YouTube', '<svg viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="3.5" fill="#fff"/><path d="M10.3 9.3v5.4l4.6-2.7z" fill="#0454a1"/></svg>']
  ];
  $$('[data-socials]').forEach(box => {
    const mobile = box.classList.contains('msocials');
    box.innerHTML = icons.map(([n, svg]) => `<a ${mobile ? 'class="msoc"' : ''} href="#" aria-label="${n}" target="_blank" rel="noopener">${svg}</a>`).join('');
  });

  /* ---------- Header: scroll state, progress bar, back-to-top ---------- */
  const header = $('header.site'), bar = $('#progress'), toTop = $('#toTop');
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('is-scrolled', y > 20);
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    toTop.classList.toggle('show', y > 700);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0 }));

  /* ---------- Menu: dropdowns + sliding hover pill ---------- */
  const menu = $('#menu'), pill = $('.menu-pill'), items = $$('#menu > li:not(.menu-pill)');
  let closeT;
  const closeAll = () => items.forEach(li => { li.classList.remove('open'); const b = $('[data-dd]', li); b && b.setAttribute('aria-expanded', 'false'); });
  const movePill = li => {
    if (!menu.classList.contains('has-pill')) { pill.classList.add('no-anim'); pill.style.width = li.offsetWidth + 'px'; pill.style.transform = `translateX(${li.offsetLeft}px)`; void pill.offsetWidth; pill.classList.remove('no-anim'); }
    menu.classList.add('has-pill'); pill.style.width = li.offsetWidth + 'px'; pill.style.transform = `translateX(${li.offsetLeft}px)`; };
  items.forEach(li => {
    const btn = $('[data-dd]', li);
    li.addEventListener('mouseenter', () => { clearTimeout(closeT); movePill(li); if (btn) { closeAll(); li.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); } else closeAll(); });
    li.addEventListener('focusin', () => movePill(li));
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); const o = li.classList.contains('open'); closeAll(); if (!o) { li.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); } });
  });
  menu.addEventListener('mouseleave', () => { menu.classList.remove('has-pill'); closeT = setTimeout(closeAll, 120); });
  document.addEventListener('click', closeAll);
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); setMobile(false); } });

  const burger = $('#burger'), mpanel = $('#mpanel');
  const setMobile = o => { burger.setAttribute('aria-expanded', o); mpanel.classList.toggle('is-open', o); };
  burger.addEventListener('click', e => { e.stopPropagation(); setMobile(burger.getAttribute('aria-expanded') !== 'true'); });
  mpanel.addEventListener('click', e => { if (e.target.closest('a')) setMobile(false); });
  document.addEventListener('click', e => { if (!mpanel.contains(e.target)) setMobile(false); });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('.num[data-count]', e.target).concat(e.target.matches('.num[data-count]') ? [e.target] : []).forEach(countUp);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(el => io.observe(el));

  /* ---------- Count-up ---------- */
  function countUp(el) {
    if (el.dataset.run) return; el.dataset.run = 1;
    const target = +el.dataset.count, plus = el.querySelector('.plus'), dur = reduce ? 1 : 1800, t0 = performance.now();
    const fmt = n => n.toLocaleString('en-US');
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.firstChild.nodeValue = fmt(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick); else el.classList.add('is-done');
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Hero slider ---------- */
  (() => {
    if (!$('#hero')) return;
    const hero = $('#hero'), slides = $$('.slide'), imgs = $$('#heroImgs img'), tag = $('#heroTag'), dotsBox = $('#dots');
    const MS = 6000; hero.style.setProperty('--slide-ms', MS + 'ms');
    let cur = 0, timer;
    const counter = document.createElement('span'); counter.className = 'counter-txt';
    const dots = slides.map((_, i) => { const d = document.createElement('button'); d.className = 'dot'; d.setAttribute('aria-label', 'Slide ' + (i + 1)); d.innerHTML = '<i></i>'; d.onclick = () => go(i); dotsBox.appendChild(d); return d; });
    dotsBox.appendChild(counter);
    function go(n) {
      const prev = cur; cur = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle('is-active', i === cur); s.classList.toggle('is-prev', i === prev && i !== cur); });
      imgs.forEach((im, i) => im.classList.toggle('is-on', i === cur));
      dots.forEach((d, i) => { d.classList.remove('is-active'); void d.offsetWidth; d.classList.toggle('is-active', i === cur); d.setAttribute('aria-current', i === cur); });
      tag.textContent = slides[cur].dataset.tag;
      counter.textContent = `${cur + 1} / ${slides.length}`;
      restart();
    }
    const restart = () => { clearTimeout(timer); if (!reduce && !hero.classList.contains('is-paused')) timer = setTimeout(() => go(cur + 1), MS); };
    $('.hero-arrow.next').onclick = () => go(cur + 1);
    $('.hero-arrow.prev').onclick = () => go(cur - 1);
    hero.addEventListener('mouseenter', () => { hero.classList.add('is-paused'); clearTimeout(timer); });
    hero.addEventListener('mouseleave', () => { hero.classList.remove('is-paused'); go(cur); });
    hero.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(cur + 1); if (e.key === 'ArrowLeft') go(cur - 1); });
    let sx; hero.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    hero.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1)); });
    document.addEventListener('visibilitychange', () => document.hidden ? clearTimeout(timer) : restart());
    go(0);
  })();

  /* ---------- Arches: tap-to-open on touch ---------- */
  $$('.arch').forEach(a => {
    a.addEventListener('click', () => a.classList.toggle('is-open'));
    a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); a.classList.toggle('is-open'); } });
  });

  /* ---------- Pillars circle ---------- */
  (() => {
    if (!$('#plist')) return;
    const data = [
      { t: 'Healthcare & Social Wellbeing', c: '#0454a1', img: 'p1.jpg', d: '[Placeholder] Primary care, prevention and psychosocial support for every family.' },
      { t: 'Education & Human Empowerment', c: '#147548', img: 'p2.jpg', d: '[Placeholder] Learning, digital skills and training that open doors to opportunity.' },
      { t: 'Economic Development', c: '#29a9e1', img: 'p3.jpg', d: '[Placeholder] Incubation, microfinance and market access for local entrepreneurs.' },
      { t: 'Community Resilience', c: '#4f9579', img: 'p4.jpg', d: '[Placeholder] Strengthening communities to face crises and rebuild together.' }
    ];
    const list = $('#plist'), svg = $('#wheelSvg'), wheel = $('#wheel'), photo = $('#wheelPhoto'), label = $('#wheelLabel');
    const C = 260, R = 238, GAP = 5, NS = 'http://www.w3.org/2000/svg';
    const pt = a => [C + R * Math.cos(a * Math.PI / 180), C + R * Math.sin(a * Math.PI / 180)];
    const segs = [], lis = [], pics = [];
    const ring = document.createElementNS(NS, 'g'); svg.appendChild(ring);
    const pointer = document.createElement('div'); pointer.className = 'wheel-pointer'; wheel.appendChild(pointer);
    data.forEach((p, i) => {
      const a0 = -90 + i * 90 + GAP / 2, a1 = a0 + 90 - GAP, mid = (a0 + a1) / 2;
      const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
      const s = document.createElementNS(NS, 'path');
      s.setAttribute('d', `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`); s.setAttribute('class', 'seg'); s.setAttribute('stroke', p.c);
      s.style.setProperty('--dx', Math.cos(mid * Math.PI / 180) * 12 + 'px'); s.style.setProperty('--dy', Math.sin(mid * Math.PI / 180) * 12 + 'px');
      ring.appendChild(s); segs.push(s);
      const li = document.createElement('li'); li.className = 'pitem rv'; li.style.setProperty('--c', p.c); li.style.setProperty('--i', i); li.tabIndex = 0;
      li.innerHTML = `<div class="pnum"><svg viewBox="0 0 64 64"><circle class="ring" cx="32" cy="32" r="28"/></svg><span>${i + 1}</span></div><div class="ptitle">${p.t.replace('&', '&amp;')}</div><div class="acc"><div class="acc-in"><p>${p.d}</p><a href="#pillars">Learn more <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a></div></div>`;
      list.appendChild(li); lis.push(li); io.observe(li);
      const im = document.createElement('img'); im.dataset.img = p.img; im.alt = ''; photo.appendChild(im); loadImg(im); pics.push(im);
      const act = () => goTo(i);
      [li, s].forEach(el => { el.addEventListener('mouseenter', act); el.addEventListener('focus', act); el.addEventListener('click', act); });
    });

    /* Slow continuous spin: the ring turns counter-clockwise; the pillar under the
       pointer at the top becomes active (photo, label and list follow). Hovering a
       pillar eases the ring round to it and pauses the spin until the mouse leaves. */
    const DEG_PER_SEC = 9;            // 40 s per full turn (10 s per pillar). Lower = slower.
    let angle = 0, cur = -1, paused = false, tween = null, last = performance.now();
    const idxAt = a => Math.floor((((-a) % 360) + 360) % 360 / 90);
    const draw = () => ring.setAttribute('transform', `rotate(${angle} ${C} ${C})`);
    function goTo(i) {
      paused = true;
      if (reduce) { set(i); return; }
      const base = -(i * 90 + 45);                       // centre segment i under the pointer
      const target = base + 360 * Math.round((angle - base) / 360);   // shortest way round
      tween = { from: angle, to: target, t0: performance.now(), dur: 900, i };
      set(i);
    }
    function frame(now) {
      const dt = Math.min((now - last) / 1000, .1); last = now;
      if (tween) {
        const p = Math.min((now - tween.t0) / tween.dur, 1), e = 1 - Math.pow(1 - p, 4);
        angle = tween.from + (tween.to - tween.from) * e;
        if (p >= 1) tween = null;
      } else if (!paused && !document.hidden) angle -= DEG_PER_SEC * dt;
      draw();
      const i = tween ? tween.i : idxAt(angle); if (i !== cur) set(i);
      requestAnimationFrame(frame);
    }
    function set(i) {
      cur = i;
      wheel.classList.add('has-active');
      segs.forEach((s, k) => s.classList.toggle('is-active', k === i));
      lis.forEach((l, k) => l.classList.toggle('is-active', k === i));
      pics.forEach((p, k) => p.classList.toggle('is-on', k === i));
      label.textContent = data[i].t;
    }
    angle = -45; draw(); set(0);
    if (!reduce) {
      const box = $('.circle-grid');
      box.addEventListener('mouseleave', () => { paused = false; last = performance.now(); });
      list.addEventListener('focusout', () => { paused = false; last = performance.now(); });
      // only spin while on screen
      new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { last = performance.now(); } }), { threshold: 0 }).observe(box);
      requestAnimationFrame(frame);
    }
  })();

  /* ---------- Partners marquee (duplicated for seamless loop) ---------- */
  (() => {
    // Add logos later as assets/img/partner1.png … (names show until then). Edit this list freely.
    const names = ['USAID', 'UNICEF', 'Government of the Netherlands', 'Mercy Corps', 'Anera', 'Lebanese Red Cross', 'World Vision', 'Berytech', 'Rene Mouawad Foundation', 'Ministry of Social Affairs'];
    const cell = (n, i) => `<div class="partner"><img data-img="partner${i + 1}.png" alt="${n}" data-fallback="${n}"></div>`;
    const track = $('#marquee');
    if (track) { const html = names.map(cell).join(''); track.innerHTML = html + html; $$('img', track).forEach(loadImg); }
    const grid = $('[data-partners]');
    if (grid) { grid.innerHTML = names.map(cell).join(''); $$('img', grid).forEach(loadImg); }
  })();

  /* ---------- SDGs + travelling tooltip ---------- */
  (() => {
    const NAMES = ['No Poverty', 'Zero Hunger', 'Good Health and Well-being', 'Quality Education', 'Gender Equality', 'Clean Water and Sanitation', 'Affordable and Clean Energy', 'Decent Work and Economic Growth', 'Industry, Innovation and Infrastructure', 'Reduced Inequalities', 'Sustainable Cities and Communities', 'Responsible Consumption and Production', 'Climate Action', 'Life Below Water', 'Life on Land', 'Peace, Justice and Strong Institutions', 'Partnerships for the Goals'];
    const COLORS = ['#e5243b', '#dda63a', '#4c9f38', '#c5192d', '#ff3a21', '#26bde2', '#fcc30b', '#a21942', '#fd6925', '#dd1367', '#fd9d24', '#bf8b2e', '#3f7e44', '#0a97d9', '#56c02b', '#00689d', '#19486a'];
    const g = NAMES.map((n, i) => [n, COLORS[i]]);
    // Mosaic layout [x, y, w, h] on a 1175 × 412 canvas — edit to re-arrange tiles
    const W = 1175, H = 412;
    const POS = [[0,0,143,222],[158,0,102,106],[274,0,147,225],[435,0,340,100],[789,0,148,139],[951,0,101,139],[1066,0,109,139],[0,237,143,174],[158,119,102,115],[158,247,102,165],[273,241,148,171],[435,285,340,127],[789,152,113,121],[916,152,112,121],[1043,152,132,260],[789,285,113,128],[916,285,112,128]];
    const ICONS = [
      '<circle cx="14" cy="10" r="4"/><path d="M9 17h10v14h-3v13h-4V31H9z"/><circle cx="34" cy="10" r="4"/><path d="M28 17h12l3 15h-4v12h-4V32h-3z"/><circle cx="24" cy="25" r="3"/><path d="M21 29h6v8h-2v7h-2v-7h-2z"/>',
      '<path d="M6 22h36a18 18 0 01-36 0z"/><path d="M16 17c0-3 2-4 2-7M24 17c0-3 2-4 2-7M32 17c0-3 2-4 2-7" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
      '<path d="M24 22c-2-6-12-6-12 1 0 6 8 10 12 14 4-4 12-8 12-14 0-7-10-7-12-1z"/><path d="M2 42h14l3-6 4 10 4-14 3 10h16" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>',
      '<path d="M24 8L2 18l22 10 22-10z"/><path d="M12 24v9c0 3 6 6 12 6s12-3 12-6v-9l-12 5z"/>',
      '<circle cx="22" cy="19" r="9" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M22 28v15M15 37h14M29 12l9-9M31 3h7v7" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
      '<path d="M11 6h26l-3 36H14z"/><path d="M24 18c-4 5-6 8-6 11a6 6 0 0012 0c0-3-2-6-6-11z" fill="var(--c)"/>',
      '<circle cx="24" cy="24" r="9"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
      '<path d="M5 44V30h8v14zM18 44V24h8v20zM31 44V16h8v28z"/><path d="M5 20l14-8 6 4 14-10" stroke="#fff" stroke-width="3" fill="none"/><path d="M33 3h11v11z"/>',
      '<path d="M24 4l16 9v18l-16 9-16-9V13z M8 13l16 9 16-9M24 22v18" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>',
      '<path d="M24 3l21 21-21 21L3 24z"/><path d="M15 20h18M15 28h18" stroke="var(--c)" stroke-width="3.5"/>',
      '<path d="M5 44V14l13-4v34zM22 44V22l10-6 11 6v22z"/><path d="M9 20h5M9 27h5M9 34h5M28 28h8M28 35h8" stroke="var(--c)" stroke-width="2.5"/>',
      '<path d="M24 24c-4-6-8-10-13-10a10 10 0 000 20c5 0 9-4 13-10 4 6 8 10 13 10a10 10 0 000-20c-5 0-9 4-13 10z" fill="none" stroke="#fff" stroke-width="4"/>',
      '<path d="M2 24C8 14 16 10 24 10s16 4 22 14c-6 10-14 14-22 14S8 34 2 24z"/><circle cx="24" cy="24" r="9" fill="var(--c)"/><circle cx="24" cy="24" r="6"/>',
      '<path d="M4 20c6-9 18-9 24 0l14-7v14l-14-7c-6 9-18 9-24 0z"/><circle cx="13" cy="19" r="1.6" fill="var(--c)"/><path d="M4 38q5-5 10 0t10 0 10 0 10 0" fill="none" stroke="#fff" stroke-width="2.5"/>',
      '<circle cx="24" cy="15" r="11"/><circle cx="14" cy="24" r="8"/><circle cx="34" cy="24" r="8"/><path d="M21 28h6v12h9v4H12v-4h9z"/>',
      '<path d="M4 32c6 0 10-4 12-8-2-6 2-12 10-12 4 0 6 2 8 6l6 2-6 3c0 10-8 18-20 18-3 0-6-2-10-9z"/>',
      '<g fill="none" stroke="#fff" stroke-width="2.5"><circle cx="24" cy="15" r="9"/><circle cx="16" cy="29" r="9"/><circle cx="32" cy="29" r="9"/></g>'
    ];
    const focus = new Set([3, 4, 8, 10, 17]); // goals the foundation contributes to (editable)
    if (!$('#sdgGrid')) return;
    const grid = $('#sdgGrid'), tt = $('#tt'), wrap = grid.parentElement;
    const pct = (v, t) => (v / t * 100).toFixed(3) + '%';
    const place = (el, [x, y, w, h]) => { el.style.left = pct(x, W); el.style.top = pct(y, H); el.style.width = pct(w, W); el.style.height = pct(h, H); };
    g.forEach(([n, c], i) => {
      const b = document.createElement('div'); b.className = 'sdg-tile' + (i === 3 || i === 11 ? ' sdg-wide' : '') + ([1, 5, 6, 8, 15, 16].includes(i) ? ' sdg-c' : '') + (i === 8 ? ' sdg-xs' : ''); b.style.setProperty('--c', c); b.dataset.i = i; b.tabIndex = 0;
      b.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b><span>${n}</span><svg viewBox="0 0 48 48" fill="#fff" aria-hidden="true">${ICONS[i]}</svg>`;
      b.setAttribute('aria-label', `SDG ${i + 1}: ${n}`); place(b, POS[i]);
      grid.appendChild(b);
    });
    const logo = document.createElement('div'); logo.className = 'sdg-logo'; place(logo, [435, 100, 340, 185]);
    logo.innerHTML = '<img data-img="logo.png" data-fallback="Michel Daher Foundation" alt="Michel Daher Foundation">'; grid.appendChild(logo); loadImg($('img', logo));
    const show = t => {
      const i = +t.dataset.i, [n, c] = g[i];
      tt.style.setProperty('--c', c);
      tt.innerHTML = `<b><i></i>SDG ${i + 1} · ${n}</b><span>${focus.has(i + 1) ? 'Directly supported by our programs' : 'Contributes through partnerships'}</span>`;
      const wr = wrap.getBoundingClientRect(), r = t.getBoundingClientRect();
      const x = Math.min(Math.max(r.left - wr.left + r.width / 2 - tt.offsetWidth / 2, 0), wr.width - tt.offsetWidth);
      tt.style.setProperty('--tt-x', x + 'px'); tt.style.setProperty('--tt-y', (r.top - wr.top - tt.offsetHeight - 12) + 'px');
      tt.dataset.show = 'true'; grid.classList.add('has-hover');
      $$('.sdg-tile', grid).forEach(k => k.classList.toggle('is-hover', k === t));
    };
    const hide = () => { tt.dataset.show = 'false'; grid.classList.remove('has-hover'); $$('.sdg-tile.is-hover', grid).forEach(k => k.classList.remove('is-hover')); };
    $$('.sdg-tile', grid).forEach(t => { t.addEventListener('mouseenter', () => show(t)); t.addEventListener('focus', () => show(t)); t.addEventListener('blur', hide); });
    grid.addEventListener('mouseleave', hide);
  })();

  /* ---------- Filter chips (projects / news / stories) ---------- */
  $$('[data-filters]').forEach(box => {
    const items = $$('[data-filter-item]', box.parentElement);
    $$('.chip', box).forEach(ch => ch.addEventListener('click', () => {
      $$('.chip', box).forEach(c => c.classList.toggle('on', c === ch));
      items.forEach(it => it.hidden = ch.dataset.f !== 'all' && it.dataset.cat !== ch.dataset.f);
    }));
  });

  /* ---------- Contact form (front-end only — wire to a backend later) ---------- */
  $$('form[data-demo]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const b = $('button', f); b.textContent = 'Thank you — message noted ✓'; b.disabled = true;
  }));

  /* ---------- Story stars ---------- */
  $$('.stars').forEach(s => s.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"/></svg>'.repeat(5));

  /* ---------- Card tilt + glare ---------- */
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('[data-tilt]').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.classList.add('is-tilting');
        c.style.setProperty('--ry', (px - .5) * 10 + 'deg'); c.style.setProperty('--rx', (.5 - py) * 10 + 'deg');
        c.style.setProperty('--gx', px * 100 + '%'); c.style.setProperty('--gy', py * 100 + '%');
      });
      c.addEventListener('pointerleave', () => { c.classList.remove('is-tilting'); c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }
})();
