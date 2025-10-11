// =========================
// Public
// =========================

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export const buildUrl = (base: string, params: QueryParams): string => {
  const usp = new URLSearchParams();

  for (const [key, val] of Object.entries(params)) {
    if (val === undefined || val === null) continue; // skip empty
    usp.append(key, String(val));
  }

  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
};

export const fetchJson = async <T>(
  url: string,
  context: string = 'request'
): Promise<T> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const data: unknown = await res.json();
    return data as T;
  } catch (err) {
    console.error(`[${context}]`, err);
    throw new Error(`Failed to ${context}. Please try again later.`);
  }
};

export const imageExists = (src: string) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

export const showError = (message: string) => {
  const container = document.getElementById('error-messages');
  const target = container || document.querySelector('main') || document.body;

  const box = document.createElement('div');
  box.setAttribute('role', 'alert');
  box.className = 'error-message';
  box.textContent = message;

  target.appendChild(box);

  // auto-remove after 5 seconds
  setTimeout(() => {
    box.remove();
  }, 5000);
};

export const toErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
};
