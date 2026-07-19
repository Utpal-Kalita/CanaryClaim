/** Smoothly scroll to a section by id, accounting for the sticky navbar. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 76;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
