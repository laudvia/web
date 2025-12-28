(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Mobile drawer
  const header = qs('.site-header');
  const menuBtn = qs('.header__menuBtn');
  const drawer = qs('.mobile-drawer');
  const drawerPanel = qs('.mobile-drawer__panel');
  const drawerClose = qs('.mobile-drawer__close');
  const drawerBackdrop = qs('.mobile-drawer__backdrop');

  let lastFocused = null;

  function openDrawer(){
    lastFocused = document.activeElement;
    drawer.hidden = false;
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    drawerPanel.focus?.();
    // focus first link
    const firstLink = qs('.mobile-nav a', drawerPanel);
    firstLink?.focus();
  }
  function closeDrawer(){
    drawer.hidden = true;
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    lastFocused?.focus?.();
  }

  menuBtn?.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) closeDrawer();
    else openDrawer();
  });
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
  qsa('.mobile-nav a').forEach(a => a.addEventListener('click', closeDrawer));

  // Dropdown
  const dropdownItem = qs('.nav-item--dropdown');
  const dropdownBtn = qs('.nav-item--dropdown .nav-link--btn');
  function closeDropdown(){
    dropdownItem?.removeAttribute('data-open');
    dropdownBtn?.setAttribute('aria-expanded', 'false');
  }
  dropdownBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = dropdownItem.getAttribute('data-open') === 'true';
    if (isOpen) closeDropdown();
    else {
      dropdownItem.setAttribute('data-open', 'true');
      dropdownBtn.setAttribute('aria-expanded', 'true');
      const first = qs('.dropdown a', dropdownItem);
      first?.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!dropdownItem) return;
    if (!dropdownItem.contains(e.target)) closeDropdown();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  // Accordion: keep only one <details> open at a time
  const accordion = qs('[data-accordion]');
  if (accordion){
    qsa('details', accordion).forEach(d => {
      d.addEventListener('toggle', () => {
        if (!d.open) return;
        qsa('details[open]', accordion).forEach(other => {
          if (other !== d) other.open = false;
        });
      });
    });
  }

  // Testimonials: simple swap on small screens
  const viewport = qs('.testimonials__viewport');
  const reviews = qsa('[data-review]');
  const prev = qs('[data-prev]');
  const next = qs('[data-next]');
  let idx = 0;

  function show(){
    // On desktop we show two; on mobile we show one (first)
    const isDesktop = window.matchMedia('(min-width: 48rem)').matches;
    reviews.forEach((r, i) => {
      if (isDesktop) {
        // show both
        r.style.display = '';
      } else {
        r.style.display = (i === idx) ? '' : 'none';
      }
    });
  }
  function step(dir){
    idx = (idx + dir + reviews.length) % reviews.length;
    show();
  }
  prev?.addEventListener('click', () => step(-1));
  next?.addEventListener('click', () => step(1));
  window.addEventListener('resize', show);
  show();

  // Start form
  const form = qs('.wallet-form');
  const status = qs('[data-form-status]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selected = qs('input[name="wallet"]:checked', form)?.value ?? '';
    status.textContent = selected ? `Selected wallet: ${selected}. (Demo) — form submission is not enabled in this lab.` : 'Please select a wallet.';
  });
})();
