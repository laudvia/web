(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Mobile drawer
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

  // Registration modal (Lab 4)
  const registerDialog = qs('#register-dialog');
  const registerForm = qs('#register-form');
  const registerOpenBtns = qsa('[data-open-register]');
  const registerCloseBtns = qsa('[data-close-register]');
  const registerPanel = qs('.modal__panel', registerDialog ?? undefined);
  const nameInput = qs('#register-name');
  const emailInput = qs('#register-email');
  const passwordInput = qs('#register-password');
  const showPasswordBtn = qs('[data-show-password]');

  let lastFocusedRegister = null;

  const registerInputs = [nameInput, emailInput, passwordInput].filter(Boolean);

  function getErrorEl(input){
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    const id = describedBy.split(/\s+/).find(Boolean);
    return id ? qs(`#${id}`) : null;
  }

  function setFieldState(input, message){
    const errorEl = getErrorEl(input);
    if (message){
      input.setAttribute('aria-invalid', 'true');
      if (errorEl){
        errorEl.textContent = message;
        errorEl.hidden = false;
      }
      return false;
    }

    input.removeAttribute('aria-invalid');
    if (errorEl){
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
    return true;
  }

  function messageForValidity(input){
    const v = input.validity;
    if (v.valid) return '';
    if (v.valueMissing) return 'This field is required.';
    if (v.tooShort) return `Minimum length is ${input.minLength} characters.`;
    if (v.tooLong) return `Maximum length is ${input.maxLength} characters.`;
    if (v.typeMismatch) return 'Please enter a valid email address.';
    if (v.patternMismatch) return 'Use letters, spaces, and hyphens only.';
    return 'Please check this field.';
  }

  function validateField(input){
    return setFieldState(input, messageForValidity(input));
  }

  function resetRegisterFormUI(){
    registerInputs.forEach((input) => {
      if (!input) return;
      setFieldState(input, '');
    });
    if (showPasswordBtn) showPasswordBtn.setAttribute('aria-pressed', 'false');
    if (passwordInput) passwordInput.type = 'password';
  }

  function openRegisterDialog(){
    if (!registerDialog?.showModal) return;
    lastFocusedRegister = document.activeElement;

    // If the mobile drawer is open, close it before opening the dialog.
    if (drawer && drawer.hidden === false) closeDrawer();

    registerDialog.showModal();
    requestAnimationFrame(() => {
      nameInput?.focus();
    });
  }

  function closeRegisterDialog(){
    if (!registerDialog) return;
    resetRegisterFormUI();
    registerDialog.close();
  }

  registerOpenBtns.forEach((btn) => btn.addEventListener('click', openRegisterDialog));
  registerCloseBtns.forEach((btn) => btn.addEventListener('click', closeRegisterDialog));

  // Close on click outside the panel
  registerDialog?.addEventListener('click', (e) => {
    if (e.target === registerDialog) closeRegisterDialog();
  });

  // Demonstrate stopPropagation() by preventing clicks inside the panel from bubbling to <dialog>
  registerPanel?.addEventListener('click', (e) => e.stopPropagation());

  registerDialog?.addEventListener('close', () => {
    lastFocusedRegister?.focus?.();
    lastFocusedRegister = null;
  });

  registerInputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
  });

  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    let firstInvalid = null;
    registerInputs.forEach((input) => {
      const ok = validateField(input);
      if (!ok && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid){
      firstInvalid.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(registerForm).entries());
    // eslint-disable-next-line no-console
    console.log('Registration form data:', data);
    registerForm.reset();
    closeRegisterDialog();
  });

  function setPasswordVisible(isVisible){
    if (!passwordInput) return;
    passwordInput.type = isVisible ? 'text' : 'password';
    showPasswordBtn?.setAttribute('aria-pressed', isVisible ? 'true' : 'false');
  }

  showPasswordBtn?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    setPasswordVisible(true);
    showPasswordBtn.setPointerCapture?.(e.pointerId);
  });
  showPasswordBtn?.addEventListener('pointerup', (e) => {
    e.preventDefault();
    setPasswordVisible(false);
    showPasswordBtn.releasePointerCapture?.(e.pointerId);
  });
  showPasswordBtn?.addEventListener('pointercancel', () => setPasswordVisible(false));
  showPasswordBtn?.addEventListener('pointerleave', () => setPasswordVisible(false));
})();
