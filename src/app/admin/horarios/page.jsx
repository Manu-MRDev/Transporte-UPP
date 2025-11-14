"use client"

import { useState } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from 'lucide-react'

export default function HorariosPage() {
  const [horarios, setHorarios] = useState([
    { id: "1", routeId: "1", datetime: "2025-01-15T08:00" },
    { id: "2", routeId: "1", datetime: "2025-01-15T09:00" },
    { id: "3", routeId: "2", datetime: "2025-01-15T08:30" },
  ])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHorario, setEditingHorario] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    routeId: "",
    datetime: "",
  })

  const handleOpenModal = (horario) => {
    if (horario) {
      setEditingHorario(horario)
      setFormData({
        routeId: horario.routeId,
        datetime: horario.datetime,
      })
    } else {
      setEditingHorario(null)
      setFormData({ routeId: "", datetime: "" })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingHorario) {
      setHorarios(horarios.map((h) => (h.id === editingHorario.id ? { ...h, ...formData } : h)))
      setToast({ message: "Horario actualizado", type: "success" })
    } else {
      setHorarios([...horarios, { id: Date.now().toString(), ...formData }])
      setToast({ message: "Horario creado", type: "success" })
    }
    setIsModalOpen(false)
  }

  const handleDuplicate = (horario) => {
    setHorarios([...horarios, { ...horario, id: Date.now().toString() }])
    setToast({ message: "Horario duplicado", type: "success" })
  }

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString("es-ES")
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Horarios</h2>
        <Button onClick={() => handleOpenModal()}>Crear Horario</Button>
      </div>

      <Table columns={["ID", "Ruta", "Fecha y Hora", "Acciones"]} loading={loading}>
        {horarios.map((horario) => (
          <tr key={horario.id} className="hover:bg-muted/50">
            <td className="px-4 py-3 text-sm">{horario.id}</td>
            <td className="px-4 py-3 text-sm">Ruta {horario.routeId}</td>
            <td className="px-4 py-3 text-sm">{formatDateTime(horario.datetime)}</td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(horario)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDuplicate(horario)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHorario ? "Editar Horario" : "Crear Horario"}
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
            <Label htmlFor="datetime">Fecha y Hora</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
              required
            />
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
