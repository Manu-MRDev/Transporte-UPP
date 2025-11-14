"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { RouteCard } from "@/components/route-card"
import { RouteDetailsDialog } from "@/components/route-details-dialog"
import { ScheduleSection } from "@/components/schedule-section"
import { NoticesSection } from "@/components/notices-section"
import { CommentsSection } from "@/components/comments-section"

import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [routes, setRoutes] = useState([])

  // 🔥 Cargar rutas en tiempo real
  useEffect(() => {
    const rutasRef = collection(db, "rutas")
    const unsubscribe = onSnapshot(rutasRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setRoutes(data)
    }, (error) => {
      console.error("Error cargando rutas:", error)
    })

    return () => unsubscribe()
  }, [])

  const openDetails = (route) => {
    setSelectedRoute(route)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Transporte Universitario</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Consulta horarios y rutas del sistema de transporte de la universidad.
          </p>
        </section>

        {/* Rutas */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Rutas Disponibles</h2>

          {routes.length === 0 ? (
            <p className="text-muted-foreground">No hay rutas registradas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <RouteCard key={route.id} route={route} onClick={openDetails} />
              ))}
            </div>
          )}
        </section>

        <ScheduleSection />
        <NoticesSection />
        <CommentsSection />
      </main>

      {/* Modal con detalles */}
      <RouteDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        route={selectedRoute}
      />

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 Sistema de Transporte Universitario.
          </p>
        </div>
      </footer>
    </div>
  )
}
