import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Container */}
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          pointerEvents: "none",
          maxWidth: "420px",
          width: "calc(100% - 3rem)",
        }}
      >
        {toasts.map((t) => {
          let bg = "rgba(16, 23, 38, 0.95)";
          let borderColor = "var(--border-color)";
          let icon = <Info size={20} color="#06b6d4" />;

          if (t.type === "success") {
            borderColor = "rgba(16, 185, 129, 0.4)";
            icon = <CheckCircle2 size={20} color="#10b981" />;
          } else if (t.type === "error") {
            borderColor = "rgba(244, 63, 94, 0.4)";
            icon = <AlertCircle size={20} color="#f43f5e" />;
          } else if (t.type === "warning") {
            borderColor = "rgba(245, 158, 11, 0.4)";
            icon = <AlertTriangle size={20} color="#f59e0b" />;
          }

          return (
            <div
              key={t.id}
              style={{
                background: bg,
                backdropFilter: "blur(12px)",
                border: `1px solid ${borderColor}`,
                borderRadius: "14px",
                padding: "0.9rem 1.1rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.85rem",
                pointerEvents: "auto",
                animation: "scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                color: "#f8fafc",
                fontSize: "0.9rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                {icon}
                <span style={{ lineHeight: 1.4 }}>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  color: "#94a3b8",
                  padding: "4px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
