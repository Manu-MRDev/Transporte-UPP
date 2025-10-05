import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function NoticesSection() {
  const notices = [
    {
      id: 1,
      type: "warning",
      title: "Desvío Temporal - Ruta A",
      message:
        "Por trabajos de mantenimiento, la ruta A tendrá un desvío temporal hasta el 15 de Octubre.",
      date: "10 Oct 2025",
    },
    {
      id: 2,
      type: "info",
      title: "Nuevo Horario Extendido",
      message: "La ruta C ahora opera hasta las 20:00 PM los fines de semana para mejor servicio nocturno.",
      date: "8 Oct 2025",
    },
    {
      id: 3,
      type: "alert",
      title: "Mantenimiento Programado",
      message: "El día 20 de Octubre habrá servicio limitado en todas las rutas por mantenimiento de flota.",
      date: "5 Oct 2025",
    },
  ]

  const getIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-chart-3" />
      case "info":
        return <Info className="h-5 w-5 text-primary" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case "warning":
        return "default"
      case "info":
        return "secondary"
      case "alert":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <section id="avisos" className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Avisos Importantes</h2>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(notice.type)}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{notice.message}</p>
                  </div>
                </div>
                <Badge variant={getBadgeVariant(notice.type)} className="shrink-0">
                  {notice.date}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
