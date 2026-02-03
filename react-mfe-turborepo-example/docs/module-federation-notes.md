# Module Federation (Vite) Notes

This repo does **not** enable Module Federation by default.

If you adopt a Vite federation plugin later, use it ONLY for:
- sharing singleton deps (React/ReactDOM) if import maps/externals aren’t viable
- structured remote loading patterns

Avoid:
- deep cross-MFE imports (distributed monolith risk)
- using federation instead of versioned contracts/events
