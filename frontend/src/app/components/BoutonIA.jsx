import { Loader2 } from "lucide-react";

const IA_STYLES = `
@keyframes _ia_scan {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
}
@keyframes _ia_blink {
  0%, 100% { opacity: 1; } 50% { opacity: 0; }
}
@keyframes _ia_dot {
  0%, 100% { opacity: 1; } 50% { opacity: 0.15; }
}
.bia-root {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0c1829;
  border: 1px solid #1e3a5f;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #bfd7f5;
  cursor: pointer;
  overflow: hidden;
  font-family: ui-monospace, "SFMono-Regular", "Cascadia Code", monospace;
  letter-spacing: 0.02em;
  transition: border-color 200ms, color 200ms, transform 150ms, opacity 150ms;
  white-space: nowrap;
}
.bia-root:not(:disabled):hover {
  border-color: #378ADD;
  color: #daeeff;
}
.bia-root:not(:disabled):active { transform: scale(0.98); }
.bia-root:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.bia-scan {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(55,138,221,0.15), transparent);
  animation: _ia_scan 2s linear infinite;
  pointer-events: none;
}
.bia-root:disabled .bia-scan { animation: none; }
.bia-cursor {
  width: 7px;
  height: 13px;
  background: #378ADD;
  border-radius: 1px;
  animation: _ia_blink 1s step-end infinite;
  flex-shrink: 0;
}
.bia-root:disabled .bia-cursor { animation: none; opacity: 0.4; }
.bia-dotgrid {
  display: grid;
  grid-template-columns: repeat(3, 4px);
  gap: 2px;
  opacity: 0.7;
  flex-shrink: 0;
}
.bia-dotgrid span {
  width: 4px; height: 4px;
  background: #378ADD;
  border-radius: 50%;
  animation: _ia_dot 1s step-end infinite;
}
.bia-dotgrid span:nth-child(2) { animation-delay: 0.11s; }
.bia-dotgrid span:nth-child(3) { animation-delay: 0.22s; }
.bia-dotgrid span:nth-child(4) { animation-delay: 0.33s; }
.bia-dotgrid span:nth-child(5) { animation-delay: 0.44s; }
.bia-dotgrid span:nth-child(6) { animation-delay: 0.55s; }
.bia-dotgrid span:nth-child(7) { animation-delay: 0.66s; }
.bia-dotgrid span:nth-child(8) { animation-delay: 0.77s; }
.bia-dotgrid span:nth-child(9) { animation-delay: 0.88s; }
.bia-root:disabled .bia-dotgrid span { animation: none; }
`;

let _injected = false;
function injectStyles() {
  if (_injected || typeof document === "undefined") return;
  _injected = true;
  const tag = document.createElement("style");
  tag.textContent = IA_STYLES;
  document.head.appendChild(tag);
}

export function BoutonIA({
  onClick,
  disabled = false,
  loading = false,
  loadingText,
  children,
  className = "",
  size = "md",
}) {
  injectStyles();
  const isDisabled = disabled || loading;
  const padding = size === "sm" ? "6px 12px" : "8px 16px";
  const fontSize = size === "sm" ? "12px" : "13px";

  return (
    <button
      className={"bia-root " + className}
      style={{ padding, fontSize }}
      onClick={onClick}
      disabled={isDisabled}
      type="button"
    >
      <div className="bia-scan" />
      {loading ? (
        <>
          <Loader2
            style={{ width: 13, height: 13, flexShrink: 0 }}
            className="animate-spin"
          />
          {loadingText || "Analyse en cours..."}
        </>
      ) : (
        <>
          <div className="bia-dotgrid">
            <span /><span /><span />
            <span /><span /><span />
            <span /><span /><span />
          </div>
          {children}
          <div className="bia-cursor" />
        </>
      )}
    </button>
  );
}