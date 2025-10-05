import { Header } from "@/components/header"
import { RouteCard } from "@/components/route-card"
import { ScheduleSection } from "@/components/schedule-section"
import { NoticesSection } from "@/components/notices-section"
import { CommentsSection } from "@/components/comments-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">Transporte Universitario</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
            Consulta horarios y rutas del sistema de transporte de UPP.
          </p>
        </section>

        {/* Routes Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Rutas Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RouteCard
              routeNumber="A"
              routeName="Pachuca - UPP"
              color="primary"
              frequency="Cada 20 min"
              operatingHours="6:00 AM - 20:00 PM"
            />
            <RouteCard
              routeNumber="B"
              routeName="Zempoala - UPP"
              color="primary"
              frequency="Cada 30 min"
              operatingHours="6:30 AM - 19:00 PM"
            />
            <RouteCard
              routeNumber="C"
              routeName="Ciudad Sahagún - UPP"
              color="primary"
              frequency="Cada 30 min"
              operatingHours="5:30 AM - 19:30 PM"
            />
          </div>
        </section>

        {/* Schedule Section */}
        <ScheduleSection />

        {/* Notices Section */}
        <NoticesSection />

        {/* Comments Section */}
        <CommentsSection />
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 UPP.
          </p>
        </div>
      </footer>
    </div>
  )
}
