"use client"
import { Toast } from "@base-ui/react/toast"
import { toast } from "@/lib/toast"

function accentColor(type: string | undefined) {
  if (type === "error") return "var(--danger)"
  if (type === "success") return "var(--lime)"
  return "var(--kraft)"
}

function ToastRegion() {
  const { toasts } = Toast.useToastManager<object>()

  return (
    <>
      <style>{`
        @keyframes toast-slide-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toast-slide-out {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(6px); }
        }
        .cic-toast-root {
          animation: toast-slide-in 0.18s ease both;
        }
        .cic-toast-root[data-ending-style] {
          animation: toast-slide-out 0.18s ease both;
        }
      `}</style>

      <Toast.Viewport
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column-reverse",
          gap: "0.5rem",
          width: "20rem",
          maxWidth: "calc(100vw - 2rem)",
          pointerEvents: "none",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {toasts.map((t) => {
          const color = accentColor(t.type)
          return (
            <Toast.Root
              key={t.id}
              toast={t}
              className="cic-toast-root"
              style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                backgroundColor: "var(--bg-3)",
                border: "1px solid var(--bg-4)",
                borderLeft: `3px solid ${color}`,
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Toast.Title
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "0.8125rem",
                    color: "var(--text-1)",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                />
              </div>
              <Toast.Close
                style={{
                  flexShrink: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-4)",
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: "1rem",
                  lineHeight: 1,
                  padding: 0,
                  marginTop: "1px",
                }}
                aria-label="Dismiss"
              >
                ×
              </Toast.Close>
            </Toast.Root>
          )
        })}
      </Toast.Viewport>
    </>
  )
}

export function Toaster({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider toastManager={toast} timeout={4000}>
      {children}
      <ToastRegion />
    </Toast.Provider>
  )
}
