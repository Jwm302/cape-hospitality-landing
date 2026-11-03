// Banner covers that take turns, one per day (Cape Town date), so we can see
// which one brings more enquiries: the chosen cover is added to each enquiry
// email. Preview a cover any day with ?cover=<id>, e.g. /?cover=beach.
// Clips live in public/media; give a new version a new file name, or browsers
// may keep showing the cached old one.

export interface Cover {
  id: string;
  webm: string;
  mp4: string;
  poster: string;
  // Tailwind classes, written out in full so Tailwind finds them: where the
  // clip is anchored, and the shade over it that keeps the white text readable.
  position: string;
  shade: string;
}

export const COVERS: Cover[] = [
  {
    id: 'classic',
    webm: '/media/hero-v5.webm',
    mp4: '/media/hero-v5.mp4',
    poster: '/media/hero-v5-poster.jpg',
    position: 'object-[35%_50%]',
    shade: 'bg-black/45',
  },
  {
    id: 'beach',
    webm: '/media/cover-beach-v1.webm',
    mp4: '/media/cover-beach-v1.mp4',
    poster: '/media/cover-beach-v1-poster.jpg',
    position: 'object-[50%_55%]',
    shade: 'bg-[#10213a]/35',
  },
];

// Picked once per page load. No cookies or browser storage.
export const COVER: Cover = (() => {
  try {
    const wanted = new URLSearchParams(window.location.search).get('cover');
    const preview = COVERS.find((c) => c.id === wanted);
    if (preview) return preview;
  } catch {
    // fall through to the daily cover
  }
  const capeTownDay = Math.floor((Date.now() + 2 * 3600_000) / 86400_000); // UTC+2, no daylight saving
  return COVERS[capeTownDay % COVERS.length];
})();
