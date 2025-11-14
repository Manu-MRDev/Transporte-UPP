"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Sidebar } from "@/components/Sidebar"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Verificando autenticación...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />
      <main className="ml-64 p-8">{children}</main>
    </div>
  )
}