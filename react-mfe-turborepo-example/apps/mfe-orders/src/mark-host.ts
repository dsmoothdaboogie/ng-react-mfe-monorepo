export function markHost(tag: string) {
  const el = document.querySelector(tag);
  if (el && !el.id) {
    el.id = "__MFE_HOST__";
  } else if (el) {
    // Also keep a stable marker id for the demo
    el.id = "__MFE_HOST__";
  }
}
