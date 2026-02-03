import React from "react";
export function Card(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="ds-card">
      <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
        <strong>{props.title}</strong>
        <span className="ds-muted">Design System</span>
      </div>
      <div style={{marginTop:10}}>{props.children}</div>
    </div>
  );
}
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className="ds-button" {...props} />;
}
