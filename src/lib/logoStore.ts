// Shared logo store with IndexedDB & localStorage persistence for user-uploaded logo
// and automatic canvas replacement of "AUDITORS" with "ADVISORS"

const DB_NAME = 'CapeHospitalityDB';
const STORE_NAME = 'branding';
const RAW_KEY = 'original_logo_raw';
const PATCHED_KEY = 'original_logo_patched';
const VIEW_MODE_KEY = 'cape_logo_view_mode'; // 'uploaded' | 'vector'
const SPELLING_KEY = 'cape_logo_spelling'; // 'ADVISORS' | 'ADVISERS'

type Listener = () => void;
const listeners = new Set<Listener>();

let rawImage: string | null = null;
let patchedImage: string | null = null;
let currentMode: 'uploaded' | 'vector' = 'vector';
let currentSpelling: 'ADVISORS' | 'ADVISERS' = 'ADVISORS';
let isInitialized = false;

// Open IndexedDB safely
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, 2);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Load initial state from IndexedDB & LocalStorage
export async function initLogoStore(): Promise<void> {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Check localStorage first for quick initial render
  try {
    const savedRaw = localStorage.getItem(RAW_KEY);
    const savedPatched = localStorage.getItem(PATCHED_KEY);
    const savedMode = localStorage.getItem(VIEW_MODE_KEY) as 'uploaded' | 'vector' | null;
    const savedSpelling = localStorage.getItem(SPELLING_KEY) as 'ADVISORS' | 'ADVISERS' | null;

    if (savedSpelling) currentSpelling = savedSpelling;
    if (savedRaw) rawImage = savedRaw;
    if (savedPatched) patchedImage = savedPatched;
    if (savedPatched || savedRaw) {
      currentMode = savedMode === 'vector' ? 'vector' : 'uploaded';
      notify();
    }
  } catch {
    // ignore
  }

  // 2. Check IndexedDB for full-res images
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      const rawReq = store.get(RAW_KEY);
      rawReq.onsuccess = async () => {
        if (rawReq.result && typeof rawReq.result === 'string') {
          rawImage = rawReq.result;
          
          const patchedReq = store.get(PATCHED_KEY);
          patchedReq.onsuccess = async () => {
            if (patchedReq.result && typeof patchedReq.result === 'string') {
              patchedImage = patchedReq.result;
            } else if (rawImage) {
              // Generate patched image if missing
              patchedImage = await patchImageWithAdvisors(rawImage, currentSpelling);
              savePatchedToDB(patchedImage);
            }
            notify();
          };
        }
      };
    }
  } catch {
    // ignore
  }
}

/**
 * Patch the original image by painting clean white over "HOSPITALITY AUDITORS"
 * and rendering "HOSPITALITY ADVISORS" (or ADVISERS) in matching brand gold typography.
 */
export function patchImageWithAdvisors(
  dataUrl: string,
  spelling: 'ADVISORS' | 'ADVISERS' = 'ADVISORS'
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      // 1. Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Calculate coordinates for the "HOSPITALITY AUDITORS" strip
      // In the original square/portrait artwork, the subtitle sits around y=64% to 68% of height
      const stripY = Math.round(height * 0.636);
      const stripHeight = Math.round(height * 0.046);
      const stripX = Math.round(width * 0.12);
      const stripWidth = Math.round(width * 0.76);

      // Clean white background over the original "HOSPITALITY AUDITORS"
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(stripX, stripY, stripWidth, stripHeight);

      // 3. Render "HOSPITALITY ADVISORS"
      const text = `HOSPITALITY ${spelling}`;
      const fontSize = Math.round(height * 0.0335);
      const letterSpacing = Math.round(width * 0.0125); // Wide elegant tracking

      ctx.fillStyle = '#b48c58'; // Authentic Cape Hospitality warm gold
      ctx.font = `600 ${fontSize}px 'Montserrat', 'Century Gothic', -apple-system, sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const centerY = stripY + stripHeight / 2;

      // Draw text with letter-spacing tracking
      drawTextWithTracking(ctx, text, width / 2, centerY, letterSpacing);

      // Export high-quality image
      const patchedDataUrl = canvas.toDataURL('image/jpeg', 0.98);
      resolve(patchedDataUrl);
    };

    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function drawTextWithTracking(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  spacing: number
) {
  // Check if browser native letterSpacing is supported on 2D context
  if ('letterSpacing' in ctx) {
    try {
      (ctx as unknown as { letterSpacing: string }).letterSpacing = `${spacing}px`;
      ctx.fillText(text, centerX, centerY);
      return;
    } catch {
      // fallback to manual
    }
  }

  // Manual character-by-character drawing with precise letter-spacing
  const chars = text.split('');
  const charWidths = chars.map((c) => ctx.measureText(c).width);
  const totalWidth = charWidths.reduce((sum, w) => sum + w, 0) + (chars.length - 1) * spacing;

  let currentX = centerX - totalWidth / 2;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], currentX + charWidths[i] / 2, centerY);
    currentX += charWidths[i] + spacing;
  }
}

// Save uploaded image to both IndexedDB and localStorage, then generate patched version
export async function saveLogoImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const rawDataUrl = e.target?.result as string;

      // Normalize size to max 1600px for storage efficiency without losing crispness
      try {
        const img = new Image();
        img.onload = async () => {
          let targetWidth = img.naturalWidth;
          let targetHeight = img.naturalHeight;
          const maxDim = 1600;

          if (targetWidth > maxDim || targetHeight > maxDim) {
            if (targetWidth > targetHeight) {
              targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
              targetWidth = maxDim;
            } else {
              targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
              targetHeight = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          let normalizedRaw = rawDataUrl;

          if (ctx) {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            normalizedRaw = canvas.toDataURL('image/jpeg', 0.95);
          }

          rawImage = normalizedRaw;

          // Automatically generate patched version with ADVISORS
          patchedImage = await patchImageWithAdvisors(normalizedRaw, currentSpelling);
          currentMode = 'uploaded';

          await persistAll();
          resolve(patchedImage);
        };
        img.onerror = async () => {
          rawImage = rawDataUrl;
          patchedImage = await patchImageWithAdvisors(rawDataUrl, currentSpelling);
          currentMode = 'uploaded';
          await persistAll();
          resolve(patchedImage);
        };
        img.src = rawDataUrl;
      } catch {
        rawImage = rawDataUrl;
        patchedImage = await patchImageWithAdvisors(rawDataUrl, currentSpelling);
        currentMode = 'uploaded';
        await persistAll();
        resolve(patchedImage);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Update spelling between 'ADVISORS' and 'ADVISERS'
export async function setLogoSpelling(spelling: 'ADVISORS' | 'ADVISERS') {
  currentSpelling = spelling;
  try {
    localStorage.setItem(SPELLING_KEY, spelling);
  } catch {
    // ignore
  }

  if (rawImage) {
    patchedImage = await patchImageWithAdvisors(rawImage, spelling);
    await persistAll();
  } else {
    notify();
  }
}

async function persistAll() {
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      if (rawImage) tx.objectStore(STORE_NAME).put(rawImage, RAW_KEY);
      if (patchedImage) tx.objectStore(STORE_NAME).put(patchedImage, PATCHED_KEY);
    }
  } catch {
    // ignore
  }

  try {
    if (patchedImage) localStorage.setItem(PATCHED_KEY, patchedImage);
    if (rawImage) localStorage.setItem(RAW_KEY, rawImage);
    localStorage.setItem(VIEW_MODE_KEY, currentMode);
    localStorage.setItem(SPELLING_KEY, currentSpelling);
  } catch {
    // LocalStorage quota may trigger, IndexedDB holds it safe
  }

  notify();
}

async function savePatchedToDB(patchedUrl: string) {
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(patchedUrl, PATCHED_KEY);
    }
  } catch {
    // ignore
  }
}

export function setLogoMode(mode: 'uploaded' | 'vector') {
  currentMode = mode;
  try {
    localStorage.setItem(VIEW_MODE_KEY, mode);
  } catch {
    // ignore
  }
  notify();
}

export function clearLogoImage() {
  rawImage = null;
  patchedImage = null;
  currentMode = 'vector';
  try {
    localStorage.removeItem(RAW_KEY);
    localStorage.removeItem(PATCHED_KEY);
    localStorage.setItem(VIEW_MODE_KEY, 'vector');
  } catch {
    // ignore
  }

  openDB().then((db) => {
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(RAW_KEY);
      tx.objectStore(STORE_NAME).delete(PATCHED_KEY);
    }
  });

  notify();
}

export function subscribeLogo(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getLogoState() {
  return {
    rawImage,
    patchedImage,
    image: patchedImage || rawImage,
    mode: currentMode,
    spelling: currentSpelling,
  };
}

function notify() {
  listeners.forEach((cb) => cb());
}
