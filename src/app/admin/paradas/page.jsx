"use client"

import { useState } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Switch } from "@/components/ui/switch"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from 'lucide-react'

export default function ParadasPage() {
  const [paradas, setParadas] = useState([
    { id: "1", name: "Campus Norte", lat: "19.4326", lng: "-99.1332", rutes: "A", isActive: true },
    { id: "2", name: "Biblioteca Central", lat: "19.4340", lng: "-99.1345", rutes: "A,B", isActive: true },
    { id: "3", name: "Estación Metro", lat: "19.4350", lng: "-99.1360", rutes: "C", isActive: true },
  ])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [selectedParada, setSelectedParada] = useState(null)
  const [editingParada, setEditingParada] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    lat: "",
    lng: "",
    rutes: "",
    isActive: true,
  })

  const handleOpenModal = (parada) => {
    if (parada) {
      setEditingParada(parada)
      setFormData({
        name: parada.name,
        lat: parada.lat,
        lng: parada.lng,
        rutes: parada.rutes,
        isActive: parada.isActive,
      })
    } else {
      setEditingParada(null)
      setFormData({ name: "", lat: "", lng: "", rutes: "", isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingParada) {
      setParadas(paradas.map((p) => (p.id === editingParada.id ? { ...p, ...formData } : p)))
      setToast({ message: "Parada actualizada", type: "success" })
    } else {
      setParadas([...paradas, { id: Date.now().toString(), ...formData }])
      setToast({ message: "Parada creada", type: "success" })
    }
    setIsModalOpen(false)
  }

  const handleToggleActive = (parada) => {
    setParadas(paradas.map((p) => (p.id === parada.id ? { ...p, isActive: !p.isActive } : p)))
    setToast({
      message: `Parada ${!parada.isActive ? "activada" : "desactivada"}`,
      type: "success",
    })
  }

  const handleViewMap = (parada) => {
    setSelectedParada(parada)
    setIsMapModalOpen(true)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Paradas</h2>
        <Button onClick={() => handleOpenModal()}>Crear Parada</Button>
      </div>

      <Table columns={["ID", "Nombre", "Ubicación", "Rutas", "Activa", "Acciones"]} loading={loading}>
        {paradas.map((parada) => (
          <tr key={parada.id} className="hover:bg-muted/50">
            <td className="px-4 py-3 text-sm">{parada.id}</td>
            <td className="px-4 py-3 text-sm font-medium">{parada.name}</td>
            <td className="px-4 py-3 text-sm text-muted-foreground">
              {parada.lat}, {parada.lng}
            </td>
            <td className="px-4 py-3 text-sm">{parada.rutes}</td>
            <td className="px-4 py-3">
              <Switch checked={parada.isActive} onChange={() => handleToggleActive(parada)} />
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(parada)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleViewMap(parada)}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingParada ? "Editar Parada" : "Crear Parada"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitud</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lng">Longitud</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="rutes">Rutas (separadas por coma)</Label>
            <Input
              id="rutes"
              placeholder="A,B,C"
              value={formData.rutes}
              onChange={(e) => setFormData({ ...formData, rutes: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isActive}
              onChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label>Activa</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)} title={selectedParada?.name || "Mapa"}>
        {selectedParada && (
          <iframe
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "0.5rem" }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(selectedParada.lng) - 0.01},${Number(selectedParada.lat) - 0.01},${Number(selectedParada.lng) + 0.01},${Number(selectedParada.lat) + 0.01}&layer=mapnik&marker=${selectedParada.lat},${selectedParada.lng}`}
          />
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
