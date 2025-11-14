"use client"

import { useState } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function AvisosPage() {
  const [avisos, setAvisos] = useState([
    { id: "1", title: "Cambio de horario", message: "Nueva salida 7:30 AM", priority: "info" },
    { id: "2", title: "Mantenimiento Ruta B", message: "Servicio suspendido hasta las 3 PM", priority: "warning" },
    { id: "3", title: "Evento deportivo", message: "Servicio adicional disponible", priority: "success" },
  ])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAviso, setEditingAviso] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "info",
  })

  const handleOpenModal = (aviso) => {
    if (aviso) {
      setEditingAviso(aviso)
      setFormData({
        title: aviso.title,
        message: aviso.message,
        priority: aviso.priority,
      })
    } else {
      setEditingAviso(null)
      setFormData({ title: "", message: "", priority: "info" })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingAviso) {
      setAvisos(avisos.map((a) => (a.id === editingAviso.id ? { ...a, ...formData } : a)))
      setToast({ message: "Aviso actualizado", type: "success" })
    } else {
      setAvisos([...avisos, { id: Date.now().toString(), ...formData }])
      setToast({ message: "Aviso creado", type: "success" })
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id) => {
    setAvisos(avisos.filter((a) => a.id !== id))
    setToast({ message: "Aviso eliminado", type: "success" })
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "warning":
        return "destructive"
      case "success":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Avisos</h2>
        <Button onClick={() => handleOpenModal()}>Crear Aviso</Button>
      </div>

      <Table columns={["ID", "Título", "Mensaje", "Prioridad", "Acciones"]} loading={loading}>
        {avisos.map((aviso) => (
          <tr key={aviso.id} className="hover:bg-muted/50">
            <td className="px-4 py-3 text-sm">{aviso.id}</td>
            <td className="px-4 py-3 text-sm font-medium">{aviso.title}</td>
            <td className="px-4 py-3 text-sm text-muted-foreground">{aviso.message}</td>
            <td className="px-4 py-3">
              <Badge variant={getPriorityVariant(aviso.priority)}>{aviso.priority}</Badge>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenModal(aviso)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(aviso.id)}>
                  Eliminar
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAviso ? "Editar Aviso" : "Crear Aviso"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="priority">Prioridad</Label>
            <select
              id="priority"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="info">Información</option>
              <option value="warning">Advertencia</option>
              <option value="success">Éxito</option>
            </select>
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
