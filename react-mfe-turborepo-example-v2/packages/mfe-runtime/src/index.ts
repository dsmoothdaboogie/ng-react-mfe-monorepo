import { getDesignSystemStyleSheet } from "@acme/design-system-styles";
import { EventEnvelopeV1 } from "@acme/contracts";

export function applyDesignSystemStyles(shadowRoot: ShadowRoot) {
  const sheet = getDesignSystemStyleSheet();
  const existing = shadowRoot.adoptedStyleSheets ?? [];
  if (!existing.includes(sheet)) shadowRoot.adoptedStyleSheets = [...existing, sheet];
}

export function emitPlatformEvent(host: HTMLElement, event: unknown) {
  const parsed = EventEnvelopeV1.safeParse(event);
  if (!parsed.success) return console.warn("Invalid event", parsed.error);
  host.dispatchEvent(new CustomEvent("mfe:event",{bubbles:true,composed:true,detail:parsed.data}));
}
