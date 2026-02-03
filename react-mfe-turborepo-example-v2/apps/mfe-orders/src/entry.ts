import r2wc from "react-to-webcomponent";
import { applyDesignSystemStyles } from "@acme/mfe-runtime";
import App from "./App";

const BaseElement = r2wc(App, {
  shadow: "open",
  props: {
    orderId: "string",
    customerId: "string"
  }
});

class StyledElement extends (BaseElement as unknown as typeof HTMLElement) {
  connectedCallback() {
    // @ts-expect-error
    super.connectedCallback?.();
    if (this.shadowRoot) applyDesignSystemStyles(this.shadowRoot);
  }
}

customElements.define("mfe-orders", StyledElement);
