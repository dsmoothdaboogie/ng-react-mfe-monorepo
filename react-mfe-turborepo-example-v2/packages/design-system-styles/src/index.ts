const css = `
:host{--ds-border:#ddd;--ds-accent:#2563eb;--ds-muted:#666;font-family:system-ui;color:#111}
.ds-card{border:1px solid var(--ds-border);border-radius:12px;padding:16px;background:#fff}
.ds-button{border:1px solid var(--ds-border);border-radius:10px;padding:10px 12px;background:var(--ds-accent);color:#fff;cursor:pointer}
.ds-muted{color:var(--ds-muted)}
`;
let sheet: CSSStyleSheet | null = null;
export function getDesignSystemStyleSheet(): CSSStyleSheet {
  if (sheet) return sheet;
  sheet = new CSSStyleSheet();
  sheet.replaceSync(css);
  return sheet;
}
