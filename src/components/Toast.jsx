"use client"

import { useEffect } from "react"
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border bg-card p-4 shadow-lg">
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
      <span className="text-sm">{message}</span>
      <Button variant="ghost" size="sm" className="h-auto p-1" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
