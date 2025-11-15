"use client"

import { useState, useEffect } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"

export default function HorariosPage() {
  const [routes, setRoutes] = useState([]) // rutas con sus datos (incluye schedules)
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRouteId, setEditingRouteId] = useState(null) // ruta seleccionada para editar horarios
  const [toast, setToast] = useState(null)

  // estado temporal de horarios en modal
  const [schedules, setSchedules] = useState({
    manana: [],
    tarde: [],
    noche: [],
  })

  const [newHour, setNewHour] = useState("") // hh:mm
  const [currentPeriod, setCurrentPeriod] = useState("manana") // manana | tarde | noche

  // cargar rutas (y sus schedules si existen)
  useEffect(() => {
    async function loadRoutes() {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, "rutas"))
        const data = snap.docs.map(d => {
          const docData = d.data() || {}
          return {
            id: d.id,
            routeNumber: docData.routeNumber || "",
            routeName: docData.routeName || docData.name || "", // distintos nombres según tus docs
            schedules: docData.schedules || { manana: [], tarde: [], noche: [] },
            isActive: typeof docData.isActive === "boolean" ? docData.isActive : true,
          }
        })
        setRoutes(data)
      } catch (e) {
        console.error("Error cargando rutas:", e)
        setToast({ message: "Error cargando rutas", type: "error" })
      }
      setLoading(false)
    }
    loadRoutes()
  }, [])

  // abrir modal para crear (sin ruta seleccionada) o editar (con ruta)
  const handleOpenModal = (route) => {
    if (route) {
      setEditingRouteId(route.id)
      setSchedules({
        manana: Array.isArray(route.schedules?.manana) ? route.schedules.manana.slice() : [],
        tarde: Array.isArray(route.schedules?.tarde) ? route.schedules.tarde.slice() : [],
        noche: Array.isArray(route.schedules?.noche) ? route.schedules.noche.slice() : [],
      })
    } else {
      setEditingRouteId(null)
      setSchedules({ manana: [], tarde: [], noche: [] })
    }
    setNewHour("")
    setCurrentPeriod("manana")
    setIsModalOpen(true)
  }

  // cuando el usuario selecciona una ruta desde el select (para crear/editar), cargamos sus schedules
  const handleSelectRoute = (e) => {
    const id = e.target.value
    if (!id) {
      // resetea
      setEditingRouteId(null)
      setSchedules({ manana: [], tarde: [], noche: [] })
      return
    }
    const route = routes.find(r => r.id === id)
    setEditingRouteId(id)
    setSchedules({
      manana: route?.schedules?.manana?.slice() || [],
      tarde: route?.schedules?.tarde?.slice() || [],
      noche: route?.schedules?.noche?.slice() || [],
    })
  }

  // agregar hora al periodo actual
  const addHour = () => {
    if (!newHour) return
    // normalizar formato HH:MM (input time gives that)
    const hour = newHour
    setSchedules(prev => ({
      ...prev,
      [currentPeriod]: [...prev[currentPeriod], hour].sort()
    }))
    setNewHour("")
  }

  const removeHour = (period, index) => {
    setSchedules(prev => ({
      ...prev,
      [period]: prev[period].filter((_, i) => i !== index)
    }))
  }

  // guardar schedules en Firestore en el doc de la ruta seleccionada
  const saveSchedules = async () => {
    if (!editingRouteId) {
      setToast({ message: "Selecciona una ruta antes de guardar", type: "error" })
      return
    }

    setLoading(true)
    try {
      const ref = doc(db, "rutas", editingRouteId)

      // asegurar arrays únicos y ordenados
      const toSave = {
        schedules: {
          manana: Array.from(new Set((schedules.manana || []).map(s => s))).sort(),
          tarde: Array.from(new Set((schedules.tarde || []).map(s => s))).sort(),
          noche: Array.from(new Set((schedules.noche || []).map(s => s))).sort(),
        }
      }

      await updateDoc(ref, toSave)

      // actualizar localmente para que la tabla refleje cambios sin recargar
      setRoutes(prev => prev.map(r => r.id === editingRouteId ? { ...r, schedules: toSave.schedules } : r))

      setToast({ message: "Horarios guardados", type: "success" })
      setIsModalOpen(false)
    } catch (e) {
      console.error("Error guardando horarios:", e)
      setToast({ message: "Error guardando horarios", type: "error" })
    }
    setLoading(false)
  }

  // eliminar todos los horarios de una ruta (opcional)
  const clearSchedulesForRoute = async (routeId) => {
    if (!routeId) return
    setLoading(true)
    try {
      const ref = doc(db, "rutas", routeId)
      const empty = { schedules: { manana: [], tarde: [], noche: [] } }
      await updateDoc(ref, empty)
      setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, schedules: empty.schedules } : r))
      setToast({ message: "Horarios eliminados", type: "success" })
    } catch (e) {
      console.error("Error limpiando horarios:", e)
      setToast({ message: "Error limpiando horarios", type: "error" })
    }
    setLoading(false)
  }

  // helper para mostrar en la tabla todos los horarios concatenados por periodo
  const renderSchedulesColumn = (schedulesObj) => {
    if (!schedulesObj) return "—"
    const makeStr = (label, arr) => (arr && arr.length ? `${label}: ${arr.join(", ")}` : null)
    const parts = [
      makeStr("Mañana", schedulesObj.manana),
      makeStr("Tarde", schedulesObj.tarde),
      makeStr("Noche", schedulesObj.noche),
    ].filter(Boolean)
    return parts.length ? parts.join(" | ") : "—"
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Horarios</h2>
        <Button onClick={() => handleOpenModal(null)}>Crear / Editar Horarios</Button>
      </div>

      <Table columns={["ID", "Ruta", "Horarios (mañana/tarde/noche)", "Acciones"]} loading={loading}>
        {routes.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
              No hay rutas registradas
            </td>
          </tr>
        ) : (
          routes.map(route => (
            <tr key={route.id} className="hover:bg-muted/50">
              <td className="px-4 py-3 text-sm">{route.id.slice(0, 8)}</td>
              <td className="px-4 py-3 text-sm font-medium">{route.routeName || route.routeNumber || "Ruta sin nombre"}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {renderSchedulesColumn(route.schedules)}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(route)}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => clearSchedulesForRoute(route.id)}>Borrar</Button>
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>

      {/* Modal: seleccionar ruta + editar horarios */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear / Editar Horarios">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            saveSchedules()
          }}
          className="space-y-4"
        >
          <div>
            <Label>Selecciona la ruta</Label>
            <select
              value={editingRouteId || ""}
              onChange={handleSelectRoute}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Selecciona una ruta</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.routeName || r.routeNumber || r.id.slice(0,8)}
                </option>
              ))}
            </select>
          </div>

          {/* period selector + add hour */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Periodo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
              >
                <option value="manana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>

            <div>
              <Label>Hora (HH:MM)</Label>
              <Input type="time" value={newHour} onChange={(e) => setNewHour(e.target.value)} />
            </div>

            <div className="flex items-end">
              <Button type="button" className="w-full" onClick={addHour}>Agregar hora</Button>
            </div>
          </div>

          {/* listados por periodo con posibilidad de borrar por item */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["manana", "tarde", "noche"].map((period) => (
              <div key={period} className="border rounded p-3">
                <h4 className="font-semibold mb-2">{period === "manana" ? "Mañana" : period.charAt(0).toUpperCase() + period.slice(1)}</h4>
                <ul className="space-y-2 min-h-[80px]">
                  {(schedules[period] || []).length === 0 ? (
                    <li className="text-sm text-muted-foreground">Sin horarios</li>
                  ) : (
                    schedules[period].map((h, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <span className="font-medium">{h}</span>
                        <button
                          type="button"
                          onClick={() => removeHour(period, i)}
                          className="text-sm px-2 py-1 rounded bg-red-50 text-red-600"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar horarios</Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
