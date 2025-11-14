"use client"

import { useState, useEffect } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Switch } from "@/components/ui/switch"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore"

export default function RutasPage() {
  const [rutas, setRutas] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRuta, setEditingRuta] = useState(null)
  const [toast, setToast] = useState(null)

  const colorOptions = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    "chart-3": "bg-chart-3 text-white",
  }

  const [formData, setFormData] = useState({
    routeNumber: "",
    routeName: "", // Origen - Destino
    color: "primary",
    frecuencia: "",
    horarioInicio: "",
    horarioFin: "",
    stops: [],
    price: "",
    priceNote: "",
    isActive: true,
  })

  useEffect(() => {
    async function loadRutas() {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "rutas"))
      const rutasData = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setRutas(rutasData)
      setLoading(false)
    }
    loadRutas()
  }, [])

  const handleOpenModal = (ruta) => {
    if (ruta) {
      setEditingRuta(ruta)
      setFormData({
        routeNumber: ruta.routeNumber || "",
        routeName: ruta.routeName || "",
        color: ruta.color || "primary",
        frecuencia: ruta.frecuencia || "",
        horarioInicio: ruta.horarioInicio || "",
        horarioFin: ruta.horarioFin || "",
        stops: ruta.stops || [],
        price: ruta.price || "",
        priceNote: ruta.priceNote || "",
        isActive: ruta.isActive,
      })
    } else {
      setEditingRuta(null)
      setFormData({
        routeNumber: "",
        routeName: "",
        color: "primary",
        frecuencia: "",
        horarioInicio: "",
        horarioFin: "",
        stops: [],
        price: "",
        priceNote: "",
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = { ...formData, stops: formData.stops.filter(Boolean) }

      if (editingRuta) {
        const ref = doc(db, "rutas", editingRuta.id)
        await updateDoc(ref, dataToSave)
        setToast({ message: "Ruta actualizada", type: "success" })
      } else {
        await addDoc(collection(db, "rutas"), dataToSave)
        setToast({ message: "Ruta creada", type: "success" })
      }

      const querySnapshot = await getDocs(collection(db, "rutas"))
      setRutas(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      setToast({ message: "Error al guardar", type: "error" })
    }
    setLoading(false)
  }

  const handleToggleActive = async (ruta) => {
    try {
      const ref = doc(db, "rutas", ruta.id)
      await updateDoc(ref, { isActive: !ruta.isActive })
      setRutas(rutas.map((r) => (r.id === ruta.id ? { ...r, isActive: !ruta.isActive } : r)))
      setToast({ message: `Ruta ${!ruta.isActive ? "activada" : "desactivada"}`, type: "success" })
    } catch (error) {
      console.error(error)
      setToast({ message: "Error al actualizar", type: "error" })
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rutas</h2>
        <Button onClick={() => handleOpenModal()}>Crear Ruta</Button>
      </div>

      <Table
        columns={[
          "ID",
          "Número",
          "Nombre (Origen - Destino)",
          "Color",
          "Frecuencia",
          "Horario",
          "Precio",
          "Activa",
          "Acciones",
        ]}
        loading={loading}
      >
        {rutas.length === 0 ? (
          <tr>
            <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
              No hay rutas registradas
            </td>
          </tr>
        ) : (
          rutas.map((ruta) => (
            <tr key={ruta.id} className="hover:bg-muted/50">
              <td className="px-4 py-3 text-sm">{ruta.id.slice(0, 8)}</td>
              <td className="px-4 py-3 text-sm">{ruta.routeNumber}</td>
              <td className="px-4 py-3 text-sm font-medium">{ruta.routeName}</td>
              <td className="px-4 py-3 text-sm">{ruta.color}</td>
              <td className="px-4 py-3 text-sm">Cada {ruta.frecuencia} min</td>
              <td className="px-4 py-3 text-sm">{ruta.horarioInicio} - {ruta.horarioFin}</td>
              <td className="px-4 py-3 text-sm">{ruta.price}</td>
              <td className="px-4 py-3">
                <Switch checked={ruta.isActive} onChange={() => handleToggleActive(ruta)} />
              </td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(ruta)}>Editar</Button>
              </td>
            </tr>
          ))
        )}
      </Table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRuta ? "Editar Ruta" : "Crear Ruta"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Número de Ruta" value={formData.routeNumber} onChange={(v) => setFormData({ ...formData, routeNumber: v })} />
            <InputField label="Nombre de Ruta (Origen - Destino)" value={formData.routeName} onChange={(v) => setFormData({ ...formData, routeName: v })} />
          </div>

          <div>
            <Label>Color de Ruta</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {Object.keys(colorOptions).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`${colorOptions[key]} w-10 h-10 rounded-full border-2 ${formData.color === key ? "border-black" : "border-transparent"}`}
                  onClick={() => setFormData({ ...formData, color: key })}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Frecuencia (minutos)" value={formData.frecuencia} onChange={(v) => setFormData({ ...formData, frecuencia: v })} />
            <div className="flex gap-2">
              <InputField label="Horario inicio" value={formData.horarioInicio} onChange={(v) => setFormData({ ...formData, horarioInicio: v })} />
              <InputField label="Horario fin" value={formData.horarioFin} onChange={(v) => setFormData({ ...formData, horarioFin: v })} />
            </div>
          </div>

          <div>
            <Label>Paradas (una por línea)</Label>
            <Textarea
              value={formData.stops.join("\n")}
              onChange={(e) => setFormData({ ...formData, stops: e.target.value.split("\n") })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Precio" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} />
            <InputField label="Nota de Precio" value={formData.priceNote} onChange={(v) => setFormData({ ...formData, priceNote: v })} />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={formData.isActive} onChange={(checked) => setFormData({ ...formData, isActive: checked })} />
            <Label>Activa</Label>
          </div>

          <div className="flex justify-end gap-2 flex-wrap">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// Componente auxiliar para inputs
function InputField({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  )
}
