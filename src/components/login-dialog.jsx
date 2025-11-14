"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from 'lucide-react'

export function LoginDialog() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    setError("")

    // Credenciales de ejemplo - en producción esto debe conectarse a una API real
    if (email === "admin@universidad.edu" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userRole", "admin")
      setIsOpen(false)
      router.push("/admin")
    } else {
      setError("Credenciales incorrectas")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Iniciar Sesión</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Iniciar Sesión</DialogTitle>
          <DialogDescription>
            Accede a tu cuenta para administrar el sistema de transporte
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@universidad.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
          <div className="mt-2 rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Demo:</strong> admin@universidad.edu / admin123
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}