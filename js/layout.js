/* ==========================================================================
   Shared layout: header, mobile menu, footer.
   EDIT THE MENU HERE — remove an item/page by deleting its line.
   Every page just contains <div id="site-header"></div> and <div id="site-footer"></div>.
   ========================================================================== */
(() => {
  const SITE = {
    name: 'Michel Daher Foundation',
    tagline: 'Michel Daher Foundation (MDF) is a local Lebanese non-profit organization founded in 2014. Its mission is to improve the livelihoods of the Lebanese people, with a particular focus on the Bekaa community, thereby contributing to the Global Sustainable Development Goals (SDGs).',
    address: 'Ferzol, Main Road, Delta Trading Building, Bekaa, Lebanon',
    phones: ['+961 70 824 879', '+961 08 952 222'],
    email: 'info@daherfoundation.org',
    social: { Facebook: 'https://www.facebook.com/DaherFoundation/', Instagram: 'https://www.instagram.com/daherfoundation/', LinkedIn: 'https://www.linkedin.com/company/mdsf-foundation/' }
  };

  // label, href (null = no page of its own), children
  const NAV = [
    { label: 'About Us', href: 'about.html', children: [
      ['Our Story', 'about.html#our-story'], ['Our Focus', 'about.html#our-focus'], ['Our Team', 'about.html#our-team'],
      ['Our Impact', 'about.html#our-impact'], ['Our Partners', 'about.html#our-partners']] },
    { label: 'What We Do', href: null, children: [
      ['Education & Human Empowerment', 'education.html'], ['Healthcare & Social Wellbeing', 'healthcare.html'],
      ['Economic Development & Livelihoods', 'economic-development.html'], ['Community Resilience & Sustainability', 'community-resilience.html']] },
    { label: 'Our Projects', href: 'projects.html', children: [
      ['Open for Application', 'projects.html#open'], ['Ongoing Projects', 'projects.html#ongoing'], ['Past Projects', 'projects.html#past']] },
    { label: 'Our Centers', href: 'centers.html', children: [
      ['Healthcare Centers', 'healthcare-centers.html'], ['LINK Incubation Center', 'link.html'],
      ['Takallam Social Center', 'takallam.html'], ['Training Center', 'training-center.html']] },
    { label: 'News', href: 'news.html' },
    { label: 'Stories', href: 'stories.html' },
    { label: 'Get Involved', href: 'get-involved.html' }
  ];

  const ICONS = {
    Facebook: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M13.4 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.8v3h2.6V21z"/></svg>',
    Instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6" fill="#fff"/></svg>',
    LinkedIn: '<svg viewBox="0 0 24 24" fill="#fff"><rect x="5" y="9.5" width="3" height="9.5"/><circle cx="6.5" cy="6.3" r="1.8"/><path d="M10.5 9.5h2.9v1.3c.5-.8 1.5-1.5 3-1.5 2.6 0 3.1 1.7 3.1 3.9V19h-3v-5.1c0-1.2 0-2.4-1.5-2.4s-1.6 1.1-1.6 2.3V19h-2.9z"/></svg>'
  };
  const caret = '<svg class="caret" viewBox="0 0 10 10"><path d="M1 3h8L5 8z" fill="currentColor"/></svg>';
  const page = location.pathname.split('/').pop() || 'index.html';
  const here = h => h && h.split('#')[0] === page;
  const socials = (cls = '') => Object.entries(SITE.social).map(([n, u]) =>
    `<a ${cls ? `class="${cls}"` : ''} href="${u}" aria-label="${n}" target="_blank" rel="noopener">${ICONS[n]}</a>`).join('');

  const menu = NAV.map(n => {
    const active = here(n.href) || (n.children || []).some(c => here(c[1])) ? ' aria-current="page"' : '';
    if (!n.children) return `<li><a href="${n.href}"${active}>${n.label}</a></li>`;
    const head = n.href ? `<a data-dd href="${n.href}"${active} aria-expanded="false">${n.label} ${caret}</a>` : `<button data-dd aria-expanded="false"${active}>${n.label} ${caret}</button>`;
    return `<li>${head}<ul class="dd">${n.children.map(c => `<li><a href="${c[1]}">${c[0].replace('&', '&amp;')}</a></li>`).join('')}</ul></li>`;
  }).join('');

  const mobile = NAV.map(n => (n.href ? `<a href="${n.href}">${n.label}</a>` : `<span class="mgroup">${n.label}</span>`) +
    (n.children && !n.href ? n.children.map(c => `<a class="msub" href="${c[1]}">${c[0].replace('&', '&amp;')}</a>`).join('') : '')).join('');

  const hdr = document.getElementById('site-header');
  if (hdr) hdr.outerHTML = `
<a class="skip" href="#main">Skip to content</a>
<div class="progress" id="progress"></div>
<header class="site" id="top"><div class="wrap nav">
  <a class="logo" href="index.html" aria-label="${SITE.name}"><img data-img="logo.png" data-fallback="${SITE.name}" alt="${SITE.name}"></a>
  <div class="nav-right">
    <ul class="menu" id="menu"><li class="menu-pill" aria-hidden="true"></li>${menu}</ul>
    <div class="socials">${socials()}</div>
    <button class="search" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10" cy="10" r="5.6"/><path d="M14.3 14.3 20 20"/></svg></button>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="mpanel"><span></span></button>
  </div></div>
  <nav class="mpanel" id="mpanel" aria-label="Mobile">${mobile}<div class="msocials">${socials('msoc')}</div></nav>
</header>`;

  const ftr = document.getElementById('site-footer');
  if (ftr) ftr.outerHTML = `
<footer><div class="wrap foot-grid">
  <div><p>${SITE.tagline}</p><img class="foot-logo" data-img="logo_white.png" data-fallback="${SITE.name}" alt="${SITE.name}"></div>
  <ul class="foot-links">${NAV.map(n => `<li><a href="${n.href || n.children[0][1]}">${n.label}</a></li>`).join('')}</ul>
  <div class="contact">
    <div><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>${SITE.address}</div>
    ${SITE.phones.map(p => `<div><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg><a href="tel:${p.replace(/\s/g, '')}">${p}</a></div>`).join('')}
    <div><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><a href="mailto:${SITE.email}">${SITE.email}</a></div>
    <div class="socials foot-soc">${socials()}</div>
    <div class="copy">© ${new Date().getFullYear()} ${SITE.name} — All Rights Reserved</div>
  </div></div></footer>
<button class="to-top" id="toTop" aria-label="Back to top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg></button>`;
})();
