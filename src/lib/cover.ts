// Banner covers. Visitors see the first one; the others can be previewed with
// ?cover=<id>, e.g. /?cover=beach. The cover shown is added to each enquiry
// email.
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
  // Seconds into the clip during which the tagline and quote fade out (the
  // logo stays), so a scene with its own words (the sand writing) can be read.
  quiet?: [number, number];
  // A slogan image (transparent PNG) that wipes in over the clip for a while.
  slogan?: { src: string; show: [number, number] };
}

export const COVERS: Cover[] = [
  {
    // The classic clip blurs into the beach, "DON'T SEND HELP" is written in
    // the sand, "We Are There For You." comes in, the view tilts down to the
    // sea, then it blurs back. Anchored further left on phones so the sand
    // writing stays in view.
    id: 'blend',
    webm: '/media/cover-blend-v3.webm',
    mp4: '/media/cover-blend-v3.mp4',
    poster: '/media/cover-blend-v3-poster.jpg',
    position: 'object-[22%_50%] sm:object-[35%_50%]',
    shade: 'bg-black/45',
    quiet: [5, 20],
    slogan: { src: '/media/slogan-we-are-there-v1.png', show: [11.5, 17.5] },
  },
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
    // fall through to the default cover
  }
  return COVERS[0];
})();
