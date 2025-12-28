(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const createEl = (tag, attrs = {}) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'text') node.textContent = String(value);
      else if (key === 'html') node.innerHTML = String(value);
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
      else if (value === false || value === null || value === undefined) {
        // skip
      } else if (key in node) {
        node[key] = value;
      } else {
        node.setAttribute(key, String(value));
      }
    });
    return node;
  };

  // Config
  const apiBase = (document.body.dataset.apiBase ?? '').replace(/\/$/, '');
  const endpoints = {
    images: `${apiBase}/images`,
    temperature: `${apiBase}/temperature`,
  };

  // Toasts
  const toastsRoot = qs('[data-toasts]');

  function showToast({ type = 'success', title, message }){
    if (!toastsRoot) return;
    const toast = createEl('div', {
      className: `toast toast--${type}`,
      role: 'status',
    });

    const top = createEl('div', { className: 'toast__top' });
    const text = createEl('div');
    text.append(
      createEl('p', { className: 'toast__title', text: title || (type === 'error' ? 'Ошибка' : 'Сообщение') }),
      createEl('p', { className: 'toast__msg', text: message || '' }),
    );

    const closeBtn = createEl('button', {
      type: 'button',
      className: 'toast__close',
      ariaLabel: 'Закрыть',
      text: '×',
      onclick: () => dismissToast(toast),
    });

    top.append(text, closeBtn);
    toast.append(top);
    toastsRoot.append(toast);

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // auto-dismiss
    window.setTimeout(() => dismissToast(toast), 6000);
  }

  function dismissToast(toast){
    if (!toast) return;
    toast.classList.remove('is-visible');
    window.setTimeout(() => toast.remove(), 220);
  }

  // Fetch helpers
  async function fetchJson(url, options){
    const res = await fetch(url, options);

    let data = null;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')){
      data = await res.json().catch(() => null);
    }

    if (!res.ok){
      const msg =
        (data && (data.message || data.error)) ||
        `Запрос не выполнен (HTTP ${res.status})`;
      throw new Error(msg);
    }

    return data ?? (await res.text());
  }

  async function fetchWithRetry(url, options, retries = 3, delayMs = 550){
    let lastError = null;

    for (let attempt = 1; attempt <= retries; attempt += 1){
      try {
        return await fetchJson(url, options);
      } catch (err){
        lastError = err;
        if (attempt < retries){
          // Small interval between attempts
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => window.setTimeout(r, delayMs));
        }
      }
    }

    throw lastError;
  }

  // Gallery
  const galleryGrid = qs('[data-gallery-grid]');
  const galleryLoader = qs('[data-gallery-loader]');
  const galleryEmpty = qs('[data-gallery-empty]');
  const refreshBtn = qs('[data-refresh-images]');

  function setGalleryLoading(isLoading){
    if (galleryLoader) galleryLoader.hidden = !isLoading;
    if (refreshBtn) refreshBtn.disabled = isLoading;
  }

  function clearGallery(){
    if (galleryGrid) galleryGrid.innerHTML = '';
  }

  function showEmptyGallery(isEmpty){
    if (galleryEmpty) galleryEmpty.hidden = !isEmpty;
  }

  function toImageCard(item, index){
    const src = item?.url || item?.src || item?.imageUrl || item?.image || '';
    const title = item?.title || item?.name || item?.caption || `Изображение ${index + 1}`;

    const card = createEl('article', { className: 'gallery-card' });
    const media = createEl('div', { className: 'gallery-card__media' });
    const img = createEl('img', {
      src,
      alt: title,
      loading: 'lazy',
    });
    media.append(img);

    const body = createEl('div', { className: 'gallery-card__body' });
    body.append(
      createEl('p', { className: 'gallery-card__title', text: title }),
      item?.id !== undefined
        ? createEl('p', { className: 'gallery-card__meta', text: `ID: ${item.id}` })
        : createEl('p', { className: 'gallery-card__meta', text: '' }),
    );

    card.append(media, body);
    return card;
  }

  async function loadImages(){
    if (!galleryGrid) return;

    setGalleryLoading(true);
    showEmptyGallery(false);
    clearGallery();

    try {
      const data = await fetchWithRetry(endpoints.images, { method: 'GET' }, 3, 650);

      if (!Array.isArray(data)){
        throw new Error('Сервер вернул данные не в формате массива.');
      }

      if (data.length === 0){
        showEmptyGallery(true);
        return;
      }

      const fragment = document.createDocumentFragment();
      data.forEach((item, index) => fragment.append(toImageCard(item, index)));
      galleryGrid.append(fragment);
    } catch (err){
      showToast({
        type: 'error',
        title: 'Не удалось загрузить галерею',
        message: err?.message || 'Неизвестная ошибка',
      });
      showEmptyGallery(true);
    } finally {
      setGalleryLoading(false);
    }
  }

  refreshBtn?.addEventListener('click', loadImages);

  // Temperature
  const tempForm = qs('[data-temp-form]');
  const roomInput = qs('#room');
  const temperatureInput = qs('#temperature');

  async function sendTemperature(payload){
    return fetchJson(endpoints.temperature, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  function setTempFormBusy(isBusy){
    if (!tempForm) return;
    [...tempForm.elements].forEach((el) => {
      if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) el.disabled = isBusy;
    });
  }

  tempForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const room = String(roomInput?.value ?? '').trim();
    const temperature = Number(temperatureInput?.value);

    if (!room){
      showToast({ type: 'error', title: 'Проверьте форму', message: 'Введите номер аудитории.' });
      roomInput?.focus();
      return;
    }
    if (Number.isNaN(temperature)){
      showToast({ type: 'error', title: 'Проверьте форму', message: 'Введите температуру числом.' });
      temperatureInput?.focus();
      return;
    }

    const payload = { room, temperature };

    setTempFormBusy(true);

    try {
      const response = await sendTemperature(payload);
      const msg = (response && (response.message || response.result)) || 'Данные успешно отправлены.';
      showToast({ type: 'success', title: 'Готово', message: msg });
      tempForm.reset();
    } catch (err){
      showToast({ type: 'error', title: 'Ошибка отправки', message: err?.message || 'Неизвестная ошибка' });
    } finally {
      setTempFormBusy(false);
    }
  });

  // Demonstrate JSON global object usage explicitly (per task wording)
  // eslint-disable-next-line no-console
  console.log('JSON demo:', JSON.parse(JSON.stringify({ ok: true })));

  // Initial load
  loadImages();
})();
