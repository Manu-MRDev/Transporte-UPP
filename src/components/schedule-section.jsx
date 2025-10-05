import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function ScheduleSection() {
  const schedules = [
    { route: "A", times: ["6:00", "6:10", "6:20", "6:30", "6:40", "6:50", "7:00"] },
    { route: "B", times: ["6:30", "6:45", "7:00", "7:15", "7:30", "7:45", "8:00"] },
    { route: "C", times: ["5:30", "5:42", "5:54", "6:06", "6:18", "6:30", "6:42"] },
  ]

  return (
    <section id="horarios" className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Horarios de Salida</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <Card key={schedule.route}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-lg font-bold">
                  {schedule.route}
                </span>
                <span className="text-base font-normal text-muted-foreground">Próximas salidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {schedule.times.map((time, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-2 rounded text-center font-mono text-sm"
                  >
                    {time}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">Horarios aproximados. Sujetos a cambios por tráfico.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
