// Non-blocking toast notifications (same call API used across the app).
// The previous implementation used window.alert(), which BLOCKS the main
// thread on every success/error message and froze the whole page.

type ToastArgs = {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

const CONTAINER_ID = 'osdm-toast-container';

function getContainer(): HTMLElement | null {
  if (typeof document === 'undefined') return null;
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.setAttribute('dir', document.documentElement.dir || 'rtl');
    container.style.cssText =
      'position:fixed;bottom:24px;inset-inline-end:24px;z-index:2147483647;' +
      'display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }
  return container;
}

function showToast({ title, description, variant }: ToastArgs) {
  const container = getContainer();
  if (!container) return;

  const isError = variant === 'destructive';
  const el = document.createElement('div');
  el.style.cssText =
    'pointer-events:auto;max-width:360px;padding:14px 18px;border-radius:12px;' +
    'box-shadow:0 10px 30px rgba(0,0,0,0.18);font-family:inherit;' +
    `background:${isError ? '#B3261E' : '#ffffff'};` +
    `color:${isError ? '#ffffff' : '#1f2937'};` +
    `border:1px solid ${isError ? '#B3261E' : '#e5e7eb'};` +
    'opacity:0;transform:translateY(10px);transition:opacity .25s ease,transform .25s ease;';

  const titleEl = document.createElement('div');
  titleEl.style.cssText = 'font-weight:700;font-size:14px;';
  titleEl.textContent = `${isError ? '❌' : '✅'} ${title}`;
  el.appendChild(titleEl);

  if (description) {
    const descEl = document.createElement('div');
    descEl.style.cssText = 'font-size:13px;margin-top:4px;opacity:.85;';
    descEl.textContent = description;
    el.appendChild(descEl);
  }

  el.addEventListener('click', () => el.remove());
  container.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

export function useToast() {
  return { toast: showToast };
}
