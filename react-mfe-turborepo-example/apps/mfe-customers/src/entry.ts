import r2wc from "react-to-webcomponent";
import { applyDesignSystemStyles } from "@acme/mfe-runtime";
import App from "./App";
import { markHost } from "./mark-host";

/**
 * Register the web component. Shadow DOM enabled.
 * r2wc mounts on connect and unmounts on disconnect.
 */
const BaseElement = r2wc(App, {
  shadow: "open",
  props: {
    orderId: "string",
    customerId: "string"
  }
});

class StyledElement extends (BaseElement as unknown as typeof HTMLElement) {
  connectedCallback() {
    // r2wc's connectedCallback mounts React
    // @ts-expect-error: exists on the generated class
    super.connectedCallback?.();

    if (this.shadowRoot) {
      applyDesignSystemStyles(this.shadowRoot);
    }
  }
}

customElements.define("mfe-customers", StyledElement);

// Dev-only convenience: mark the first element as the event host for demo.
markHost("mfe-customers");
