"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export function ScheduleSection() {
  const [routes, setRoutes] = useState([])

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "rutas"))
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        setRoutes(data)
      } catch (error) {
        console.error("Error cargando rutas:", error)
      }
    }

    fetchRoutes()
  }, [])

  return (
    <section id="horarios" className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Horarios de Salida</h2>
      </div>

      {routes.length === 0 && (
        <p className="text-muted-foreground">Cargando horarios...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((route) => (
          <Card key={route.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-lg font-bold">
                  {route.routeNumber}
                </span>
                <span className="text-base font-normal text-muted-foreground">
                  {route.routeName}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* Mañana */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Mañana</h4>
                <div className="grid grid-cols-3 gap-2">
                  {route.schedules?.manana?.map((time, i) => (
                    <div key={i} className="bg-secondary text-secondary-foreground px-3 py-2 rounded text-center font-mono text-sm">
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tarde */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Tarde</h4>
                <div className="grid grid-cols-3 gap-2">
                  {route.schedules?.tarde?.map((time, i) => (
                    <div key={i} className="bg-secondary text-secondary-foreground px-3 py-2 rounded text-center font-mono text-sm">
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              {/* Noche */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Noche</h4>
                <div className="grid grid-cols-3 gap-2">
                  {route.schedules?.noche?.map((time, i) => (
                    <div key={i} className="bg-secondary text-secondary-foreground px-3 py-2 rounded text-center font-mono text-sm">
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Horarios aproximados. Sujetos a cambios por tráfico.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
