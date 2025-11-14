"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, MapPin, Map, Clock } from 'lucide-react'
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"

export default function AdminPage() {
  const [stats, setStats] = useState({
    combisActivas: 0,
    paradasActivas: 0,
    totalRutas: 0,
    totalHorarios: 0,
  })
  const [loading, setLoading] = useState(true)

  async function getStats() {
    const combis = await getDocs(collection(db, "combis"))
    const paradas = await getDocs(collection(db, "paradas"))
    const rutas = await getDocs(collection(db, "rutas"))
    const horarios = await getDocs(collection(db, "horarios"))

    return {
      combisActivas: combis.size,
      paradasActivas: paradas.size,
      totalRutas: rutas.size,
      totalHorarios: horarios.size,
    }
  }

  useEffect(() => {
    async function load() {
      const data = await getStats()
      setStats(data)
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { title: "Combis Activas", value: stats.combisActivas, icon: Bus, color: "text-blue-500" },
    { title: "Paradas Activas", value: stats.paradasActivas, icon: MapPin, color: "text-green-500" },
    { title: "Rutas", value: stats.totalRutas, icon: Map, color: "text-purple-500" },
    { title: "Reglas de Horario", value: stats.totalHorarios, icon: Clock, color: "text-orange-500" },
  ]

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-2xl font-bold text-muted-foreground">...</div>
                ) : (
                  <div className="text-2xl font-bold">{card.value}</div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
