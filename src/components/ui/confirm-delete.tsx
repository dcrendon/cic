"use client"

import * as React from "react"
import { Popover } from "@base-ui/react/popover"
import { Trash2, AlertTriangle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmDeleteProps {
  onConfirm: () => void
  isLoading?: boolean
  description?: string
  className?: string
}

export function ConfirmDelete({
  onConfirm,
  isLoading,
  description = "Are you sure you want to delete this?",
  className,
}: ConfirmDeleteProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cn(
          "flex size-7 items-center justify-center rounded-md border border-transparent bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50",
          className
        )}
        title="Delete"
        disabled={isLoading}
      >
        <Trash2 size={14} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="left" sideOffset={8} align="center">
          <Popover.Popup 
            style={{
              backgroundColor: "var(--bg-3)",
              border: "1px solid var(--bg-4)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              width: "280px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              zIndex: 100,
            }}
            className="origin-(--transform-origin) outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <div style={{ 
                  backgroundColor: "var(--danger-dim)", 
                  padding: "0.5rem", 
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <AlertTriangle size={18} style={{ color: "var(--danger)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <div style={{ 
                    fontFamily: "Barlow Condensed, sans-serif", 
                    fontWeight: 800, 
                    fontSize: "1rem", 
                    color: "var(--text-1)",
                    textTransform: "uppercase",
                    letterSpacing: "0.02em"
                  }}>
                    Confirm Deletion
                  </div>
                  <p style={{ 
                    fontFamily: "IBM Plex Sans, sans-serif",
                    fontSize: "0.85rem", 
                    color: "var(--text-3)",
                    lineHeight: "1.4",
                    margin: 0
                  }}>
                    {description}
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
                <Popover.Close 
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
                  style={{
                    backgroundColor: "var(--bg-4)",
                    border: "1px solid var(--bg-4)",
                    color: "var(--text-2)",
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    height: "2.25rem"
                  }}
                >
                  Cancel
                </Popover.Close>
                <button
                  onClick={() => {
                    onConfirm()
                    setOpen(false)
                  }}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    backgroundColor: "var(--danger)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    height: "2.25rem",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
            <Popover.Arrow 
              style={{
                fill: "var(--bg-3)",
                stroke: "var(--bg-4)",
                strokeWidth: "1px",
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
