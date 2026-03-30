import { Loader2 } from "lucide-react";

const IA_STYLES = `
@keyframes _ia_scan {
  0% { top: 0; }
  100% { top: 100%; }
}
@keyframes _ia_blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.3; }
}
@keyframes _ia_dot {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.3; }
}
.bia-root {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}
.bia-root:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(168, 85, 247, 0.3);
}
.bia-root:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.bia-root {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
}
.bia-root:not(:disabled):hover {
  background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
}
.bia-root.bia-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%);
}
.bia-root.bia-blue:not(:disabled):hover {
  background: linear-gradient(135deg, #2563eb 0%, #0284c7 100%);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}
.bia-root.bia-green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
.bia-root.bia-green:not(:disabled):hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
}
.bia-scan {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: _ia_scan 2s linear infinite;
  pointer-events: none;
}
.bia-root:disabled .bia-scan { animation: none; }
.bia-cursor {
  width: 7px;
  height: 13px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1px;
  animation: _ia_blink 1s step-end infinite;
  flex-shrink: 0;
}
.bia-root:disabled .bia-cursor { animation: none; opacity: 0.4; }
.bia-dotgrid {
  display: grid;
  grid-template-columns: repeat(3, 4px);
  gap: 2px;
  opacity: 0.8;
  flex-shrink: 0;
}
.bia-dotgrid span {
  width: 4px; height: 4px;
  background: rgba(255, 255, 255, 0.9);
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
  variant = "default",
}) {
  injectStyles();
  const isDisabled = disabled || loading;
  const padding = size === "sm" ? "6px 12px" : "8px 16px";
  const fontSize = size === "sm" ? "12px" : "13px";

  const variantClass = variant === "blue" ? "bia-blue" : variant === "green" ? "bia-green" : "";

  return (
    <button
      className={"bia-root " + variantClass + " " + className}
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