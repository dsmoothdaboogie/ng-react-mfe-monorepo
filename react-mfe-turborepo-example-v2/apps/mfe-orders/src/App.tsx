import React, { useMemo, useState } from "react";
import { Card, Button } from "@acme/design-system-react";
import { emitPlatformEvent } from "@acme/mfe-runtime";

type Props = { orderId?: string; customerId?: string };

export default function App(props: Props) {
  const [count, setCount] = useState(0);
  const id = useMemo(() => props.orderId ?? props.customerId ?? "N/A", [props.orderId, props.customerId]);

  function fireEvent() {
    const host = (document.getElementById("__MFE_HOST__") as HTMLElement) || document.body;
    emitPlatformEvent(host, {
      type: "order/selected",
      version: 1,
      correlationId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      source: "mfe-orders",
      payload: { id }
    });
  }

  return (
    <div style={{ padding: 12 }}>
      <Card title="mfe-orders">
        <div className="ds-muted">React externalized via import map</div>
        <div style={{ marginTop: 10 }}>
          <div><strong>Incoming id:</strong> {id}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <Button onClick={{ () => setCount((c) => c + 1) }}>Local state: {count}</Button>
            <Button onClick={{ fireEvent }}>Emit mfe:event</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
