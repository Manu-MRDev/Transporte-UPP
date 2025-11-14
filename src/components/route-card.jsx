import { Bus, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RouteCard({ route, onClick }) {
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    "chart-3": "bg-chart-3 text-white",
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(route)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`${colorClasses[route.color]} px-4 py-2 rounded-lg font-bold text-2xl`}>
            {route.routeNumber}
          </div>

          <Badge variant={route.isActive ? "secondary" : "destructive"} className="gap-1">
            <Bus className="h-3 w-3" />
            {route.isActive ? "Activa" : "Inactiva"}
          </Badge>
        </div>

        <CardTitle className="text-xl mt-4">{route.routeName}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {route.frecuencia ? `Cada ${route.frecuencia} min` : "Sin frecuencia"}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {route.horarioInicio && route.horarioFin
            ? `${route.horarioInicio} - ${route.horarioFin}`
            : "Horario no definido"}
        </div>

        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            onClick(route)
          }}
        >
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  )
}
