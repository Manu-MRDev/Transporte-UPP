"use client"

import { useState, useEffect } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"

export default function AvisosPage() {
  const [avisos, setAvisos] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAviso, setEditingAviso] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "info",
  })

  // 🔥 Cargar avisos desde Firestore
  useEffect(() => {
    async function loadAvisos() {
      setLoading(true)
      try {
        const snapshot = await getDocs(collection(db, "avisos"))
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setAvisos(data)
      } catch (error) {
        console.error(error)
        setToast({ message: "Error cargando avisos", type: "error" })
      }
      setLoading(false)
    }
    loadAvisos()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingAviso) {
        const ref = doc(db, "avisos", editingAviso.id)
        await updateDoc(ref, formData)
        setAvisos(avisos.map(a => (a.id === editingAviso.id ? { ...a, ...formData } : a)))
        setToast({ message: "Aviso actualizado", type: "success" })
      } else {
        const ref = await addDoc(collection(db, "avisos"), formData)
        setAvisos([...avisos, { id: ref.id, ...formData }])
        setToast({ message: "Aviso creado", type: "success" })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      setToast({ message: "Error al guardar aviso", type: "error" })
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    try {
      const ref = doc(db, "avisos", id)
      await deleteDoc(ref)
      setAvisos(avisos.filter(a => a.id !== id))
      setToast({ message: "Aviso eliminado", type: "success" })
    } catch (error) {
      console.error(error)
      setToast({ message: "Error al eliminar aviso", type: "error" })
    }
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
        {avisos.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
              No hay avisos registrados
            </td>
          </tr>
        ) : (
          avisos.map((aviso) => (
            <tr key={aviso.id} className="hover:bg-muted/50">
              <td className="px-4 py-3 text-sm">{aviso.id.slice(0, 8)}</td>
              <td className="px-4 py-3 text-sm font-medium">{aviso.title}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{aviso.message}</td>
              <td className="px-4 py-3">
                <Badge variant={getPriorityVariant(aviso.priority)}>{aviso.priority}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenModal(aviso)}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(aviso.id)}>Eliminar</Button>
                </div>
              </td>
            </tr>
          ))
        )}
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
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
