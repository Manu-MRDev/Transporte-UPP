"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, DollarSign } from "lucide-react"

export function RouteDetailsDialog({ open, onOpenChange, route }) {
  if (!route) return null

  // Horarios cargados desde Firebase
  const schedules = route.schedules || {}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-xl">
              {route.routeNumber}
            </div>
            <DialogTitle className="text-2xl">{route.routeName}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">

          {/* Paradas */}
          {route.stops && route.stops.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Paradas de la ruta
              </h3>

              <div className="flex flex-wrap gap-2 mt-2">
                {route.stops.map((stop, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {stop}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Precio */}
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">Precio del Pasaje</span>
              </div>
              <div className="text-2xl font-bold text-primary">{route.price}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {route.priceNote || "Estudiantes con credencial vigente"}
            </p>
          </div>

          {/* Horarios dinámicos desde Firebase */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Horarios Completos
            </h3>

            {Object.keys(schedules).length === 0 && (
              <p className="text-sm text-muted-foreground">No hay horarios registrados.</p>
            )}

            {Object.keys(schedules).map((key) => (
              <div key={key} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground capitalize">
                  {key}
                </h4>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {schedules[key].map((time, index) => (
                    <div
                      key={index}
                      className="bg-background border rounded-md px-3 py-2 text-center text-sm font-medium hover:bg-accent/10 transition-colors"
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Información dinámica adicional */}
          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-1">
            <p>
              <strong>Frecuencia:</strong>{" "}
              {route.frecuencia ? `Cada ${route.frecuencia} minutos` : "No definida"}
            </p>
            <p>
              <strong>Horario de operación:</strong>{" "}
              {route.horarioInicio && route.horarioFin
                ? `${route.horarioInicio} - ${route.horarioFin}`
                : "No definido"}
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              * Los horarios pueden variar según condiciones del tráfico y eventos especiales
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}