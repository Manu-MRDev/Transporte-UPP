import { Bus } from "lucide-react"
import { LoginDialog } from "@/components/login-dialog"

export function Header() {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Bus className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl">PotroBus</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#rutas" className="text-sm font-medium hover:text-primary transition-colors">
              Rutas
            </a>
            <a href="#horarios" className="text-sm font-medium hover:text-primary transition-colors">
              Horarios
            </a>
            <a href="#avisos" className="text-sm font-medium hover:text-primary transition-colors">
              Avisos
            </a>
            <a href="#comentarios" className="text-sm font-medium hover:text-primary transition-colors">
              Comentarios
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <LoginDialog />
          </div>
        </div>
      </div>
    </header>
  )
}
