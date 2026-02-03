import React, { useMemo, useState } from "react";
import { Card, Button } from "@acme/design-system-react";
import { emitPlatformEvent } from "@acme/mfe-runtime";

type Props = {
  orderId?: string;
  customerId?: string;
};

export default function App(props: Props) {
  const [count, setCount] = useState(0);
  const id = useMemo(() => props.orderId ?? props.customerId ?? "N/A", [props.orderId, props.customerId]);

  function fireEvent() {
    // Emit from the host element (closest custom element), if present.
    // r2wc renders into the shadow root, so we climb to its host.
    const host = (document.getElementById("__MFE_HOST__") as HTMLElement) || document.body;

    emitPlatformEvent(host, {
      type: "customer/selected",
      version: 1,
      correlationId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      source: "mfe-customers",
      payload: { id }
    });
  }

  return (
    <div style={{ padding: 12 }}>
      <Card title="mfe-customers">
        <div className="ds-muted">Shadow DOM enabled • DS styles via adoptedStyleSheets</div>
        <div style={{ marginTop: 10 }}>
          <div>
            <strong>Incoming id:</strong> {id}
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <Button onClick={() => setCount((c) => c + 1)}>Local state: {count}</Button>
            <Button onClick={fireEvent}>Emit mfe:event</Button>
          </div>

          <div style={{ marginTop: 12 }} className="ds-muted">
            Note: In the Angular shell, you should attach an event listener on a wrapper element
            and handle <code>mfe:event</code> (bubbling + composed) with change detection as needed.
          </div>
        </div>
      </Card>
    </div>
  );
}
