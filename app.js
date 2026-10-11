(() => {
  'use strict';
  const config = window.CBS_SITE_CONFIG || {};
  const version = config.version || '16.0.0';
  document.querySelectorAll('[data-version]').forEach((node) => { node.textContent = version; });
  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const menuButton = document.querySelector('.mobile-menu');
  const nav = document.getElementById('primary-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const downloadMap = {
    installer: { url: config.installerUrl || 'downloads/Church-Border-Studio-Setup-16.0.0.exe', label: 'Windows installer' },
    portable: { url: config.portableUrl || 'downloads/Church-Border-Studio-Portable-16.0.0.exe', label: 'portable version' }
  };
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  }
  function setDownloadState(kind, available, url, size) {
    document.querySelectorAll(`[data-download="${kind}"]`).forEach((link) => {
      link.href = url;
      link.setAttribute('aria-disabled', String(!available));
      link.classList.toggle('is-unavailable', !available);
      link.dataset.ready = String(available);
      if (available) {
        link.removeAttribute('aria-describedby');
        if (/^https?:\/\//i.test(url)) {
          link.removeAttribute('download');
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        } else {
          link.setAttribute('download', '');
          link.removeAttribute('target');
          link.removeAttribute('rel');
        }
        if (kind === 'installer') {
          link.querySelectorAll('small').forEach((small) => { small.textContent = size ? `Windows 10/11 · 64-bit · ${size}` : 'Windows 10/11 · 64-bit'; });
        }
      } else {
        link.removeAttribute('download');
        link.setAttribute('aria-describedby', 'download-note');
      }
    });
  }
  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '';
    return bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(2)} GB` : `${Math.round(bytes / 1024 ** 2)} MB`;
  }
  async function checkDownload(kind) {
    const item = downloadMap[kind];
    if (!item) return;
    if (config.verifyLocalFiles === false || /^https?:\/\//i.test(item.url)) {
      setDownloadState(kind, true, item.url, '');
      if (kind === 'installer') updateDownloadNotes(true);
      return;
    }
    try {
      const response = await fetch(item.url, { method: 'HEAD', cache: 'no-store' });
      if (response.ok) {
        const size = formatBytes(Number(response.headers.get('content-length')));
        setDownloadState(kind, true, item.url, size);
        if (kind === 'installer') updateDownloadNotes(true);
      } else {
        setDownloadState(kind, false, item.url, '');
      }
    } catch (_) {
      setDownloadState(kind, false, item.url, '');
    }
  }
  function updateDownloadNotes(installerAvailable) {
    const mainNote = document.getElementById('primary-download-note');
    const downloadNote = document.getElementById('download-note');
    const message = installerAvailable
      ? 'Installer found. Check the publisher and source before running any downloaded application.'
      : 'Installer download will activate when the installer file is added to the website.';
    if (mainNote) mainNote.textContent = message;
    if (downloadNote) downloadNote.textContent = installerAvailable
      ? 'Installer is available. The portable build can be added separately if you want to offer both choices.'
      : 'Download links activate when the matching .exe files are uploaded to this site’s downloads folder.';
  }
  Object.keys(downloadMap).forEach((kind) => checkDownload(kind));

  document.querySelectorAll('[data-download]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        const kind = link.dataset.download;
        showToast(`${downloadMap[kind]?.label || 'Download'} is not uploaded yet. See the website publishing guide.`);
      }
    });
  });

  // A small, accessible rotating highlight in the preset samples; no flashing.
  const samples = document.querySelectorAll('.look-sample');
  if (samples.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let active = 0;
    window.setInterval(() => {
      samples.forEach((sample) => sample.classList.remove('sample-highlight'));
      samples[active % samples.length].classList.add('sample-highlight');
      active += 1;
    }, 3600);
  }
})();
