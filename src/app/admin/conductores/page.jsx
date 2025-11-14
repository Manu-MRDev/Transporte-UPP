"use client"

import { useState } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Switch } from "@/components/ui/switch"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ConductoresPage() {
  const [conductores, setConductores] = useState([
    { id: "1", name: "Juan Pérez", phone: "555-0001", combiId: "ABC-123", isActive: true },
    { id: "2", name: "María García", phone: "555-0002", combiId: "DEF-456", isActive: true },
    { id: "3", name: "Carlos López", phone: "555-0003", combiId: "GHI-789", isActive: false },
  ])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingConductor, setEditingConductor] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    combiId: "",
    isActive: true,
  })

  const handleOpenModal = (conductor) => {
    if (conductor) {
      setEditingConductor(conductor)
      setFormData({
        name: conductor.name,
        phone: conductor.phone,
        combiId: conductor.combiId,
        isActive: conductor.isActive,
      })
    } else {
      setEditingConductor(null)
      setFormData({ name: "", phone: "", combiId: "", isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingConductor) {
      setConductores(conductores.map((c) => (c.id === editingConductor.id ? { ...c, ...formData } : c)))
      setToast({ message: "Conductor actualizado", type: "success" })
    } else {
      setConductores([...conductores, { id: Date.now().toString(), ...formData }])
      setToast({ message: "Conductor creado", type: "success" })
    }
    setIsModalOpen(false)
  }

  const handleToggleActive = (conductor) => {
    setConductores(conductores.map((c) => (c.id === conductor.id ? { ...c, isActive: !c.isActive } : c)))
    setToast({
      message: `Conductor ${!conductor.isActive ? "activado" : "desactivado"}`,
      type: "success",
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Conductores</h2>
        <Button onClick={() => handleOpenModal()}>Crear Conductor</Button>
      </div>

      <Table columns={["ID", "Nombre", "Teléfono", "Combi Asignada", "Activo", "Acciones"]} loading={loading}>
        {conductores.map((conductor) => (
          <tr key={conductor.id} className="hover:bg-muted/50">
            <td className="px-4 py-3 text-sm">{conductor.id}</td>
            <td className="px-4 py-3 text-sm font-medium">{conductor.name}</td>
            <td className="px-4 py-3 text-sm">{conductor.phone}</td>
            <td className="px-4 py-3 text-sm">{conductor.combiId}</td>
            <td className="px-4 py-3">
              <Switch checked={conductor.isActive} onChange={() => handleToggleActive(conductor)} />
            </td>
            <td className="px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => handleOpenModal(conductor)}>
                Editar
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingConductor ? "Editar Conductor" : "Crear Conductor"}
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
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="combiId">Combi Asignada</Label>
            <Input
              id="combiId"
              value={formData.combiId}
              onChange={(e) => setFormData({ ...formData, combiId: e.target.value })}
              placeholder="Placa de la combi"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.isActive}
              onChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
            <Label>Activo</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
