/**
 * Constructed stylesheet for Shadow DOM via adoptedStyleSheets.
 * In real life you’d generate this from your DS build output.
 */
const css = `
:host {
  --ds-font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --ds-fg: #111;
  --ds-bg: #fff;
  --ds-muted: #666;
  --ds-border: #ddd;
  --ds-accent: #2563eb;
  font-family: var(--ds-font);
  color: var(--ds-fg);
  background: transparent;
}

.ds-card {
  border: 1px solid var(--ds-border);
  border-radius: 12px;
  padding: 16px;
  background: var(--ds-bg);
}

.ds-button {
  border: 1px solid var(--ds-border);
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--ds-accent);
  color: white;
  cursor: pointer;
}

.ds-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ds-muted { color: var(--ds-muted); }
`;

let sheet: CSSStyleSheet | null = null;

export function getDesignSystemStyleSheet(): CSSStyleSheet {
  if (sheet) return sheet;
  sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
}
