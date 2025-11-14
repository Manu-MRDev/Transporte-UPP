"use client"

import { useState } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Switch } from "@/components/ui/switch"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CombisPage() {
  const [combis, setCombis] = useState([
    { id: "1", routeId: "1", plate: "ABC-123", isActive: true },
    { id: "2", routeId: "1", plate: "DEF-456", isActive: true },
    { id: "3", routeId: "2", plate: "GHI-789", isActive: false },
  ])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCombi, setEditingCombi] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    routeId: "",
    plate: "",
    isActive: true,
  })

  const handleOpenModal = (combi) => {
    if (combi) {
      setEditingCombi(combi)
      setFormData({
        routeId: combi.routeId,
        plate: combi.plate,
        isActive: combi.isActive,
      })
    } else {
      setEditingCombi(null)
      setFormData({ routeId: "", plate: "", isActive: true })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCombi) {
      setCombis(combis.map((c) => (c.id === editingCombi.id ? { ...c, ...formData } : c)))
      setToast({ message: "Combi actualizada", type: "success" })
    } else {
      setCombis([...combis, { id: Date.now().toString(), ...formData }])
      setToast({ message: "Combi creada", type: "success" })
    }
    setIsModalOpen(false)
  }

  const handleToggleActive = (combi) => {
    setCombis(combis.map((c) => (c.id === combi.id ? { ...c, isActive: !c.isActive } : c)))
    setToast({
      message: `Combi ${!combi.isActive ? "activada" : "desactivada"}`,
      type: "success",
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Combis</h2>
        <Button onClick={() => handleOpenModal()}>Crear Combi</Button>
      </div>

      <Table columns={["ID", "Ruta", "Placa", "Activa", "Acciones"]} loading={loading}>
        {combis.map((combi) => (
          <tr key={combi.id} className="hover:bg-muted/50">
            <td className="px-4 py-3 text-sm">{combi.id}</td>
            <td className="px-4 py-3 text-sm">Ruta {combi.routeId}</td>
            <td className="px-4 py-3 text-sm">{combi.plate}</td>
            <td className="px-4 py-3">
              <Switch checked={combi.isActive} onChange={() => handleToggleActive(combi)} />
            </td>
            <td className="px-4 py-3">
              <Button variant="ghost" size="sm" onClick={() => handleOpenModal(combi)}>
                Editar
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCombi ? "Editar Combi" : "Crear Combi"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="routeId">ID de Ruta</Label>
            <Input
              id="routeId"
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="plate">Placa</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
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

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
