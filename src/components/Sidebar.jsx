"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Home, Map, Bus, Clock, MapPin, Users, MessageSquare, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  { href: "/admin/rutas", icon: Map, label: "Rutas" },
  { href: "/admin/combis", icon: Bus, label: "Combis" },
  { href: "/admin/horarios", icon: Clock, label: "Horarios" },
  { href: "/admin/paradas", icon: MapPin, label: "Paradas" },
  { href: "/admin/conductores", icon: Users, label: "Conductores" },
  { href: "/admin/avisos", icon: MessageSquare, label: "Avisos" },
]

export function Sidebar({ onLogout }) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-primary">Panel Admin</h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </aside>
  )
}
