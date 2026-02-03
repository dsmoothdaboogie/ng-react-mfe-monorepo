import { getDesignSystemStyleSheet } from "@acme/design-system-styles";
import { EventEnvelopeV1 } from "@acme/contracts";

/** Inject DS stylesheet into a ShadowRoot (idempotent). */
export function applyDesignSystemStyles(shadowRoot: ShadowRoot) {
  const sheet = getDesignSystemStyleSheet();
  const existing = shadowRoot.adoptedStyleSheets ?? [];
  if (!existing.includes(sheet)) {
    shadowRoot.adoptedStyleSheets = [...existing, sheet];
  }
}

/**
 * Emit a versioned platform event from a custom element host.
 * Uses bubbles + composed so the event crosses Shadow DOM boundary.
 */
export function emitPlatformEvent(host: HTMLElement, event: unknown) {
  const parsed = EventEnvelopeV1.safeParse(event);
  if (!parsed.success) {
    console.warn("Invalid platform event envelope", parsed.error);
    return;
  }

  host.dispatchEvent(
    new CustomEvent("mfe:event", {
      bubbles: true,
      composed: true,
      detail: parsed.data
    })
  );
}
