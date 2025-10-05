import { Bus, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RouteCard({ routeNumber, routeName, color, frequency, operatingHours }) {
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    "chart-3": "bg-chart-3 text-white",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`${colorClasses[color]} px-4 py-2 rounded-lg font-bold text-2xl`}>{routeNumber}</div>
          <Badge variant="secondary" className="gap-1">
            <Bus className="h-3 w-3" />
            Activa
          </Badge>
        </div>
        <CardTitle className="text-xl mt-4">{routeName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{frequency}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{operatingHours}</span>
        </div>
        <Button className="w-full mt-4 bg-transparent" variant="outline">
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  )
}
