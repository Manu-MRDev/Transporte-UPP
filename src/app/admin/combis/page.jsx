"use client"

import { useState, useEffect } from "react"
import { Table } from "@/components/Table"
import { Modal } from "@/components/Modal"
import { Switch } from "@/components/ui/switch"
import { Toast } from "@/components/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { db } from "@/lib/firebase"
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore"

export default function CombisPage() {
  const [combis, setCombis] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCombi, setEditingCombi] = useState(null)
  const [toast, setToast] = useState(null)

  const [formData, setFormData] = useState({
    routeId: "",
    plate: "",
    isActive: true,
  })

  // 🔥 Cargar combis desde Firestore
  useEffect(() => {
    async function loadCombis() {
      setLoading(true)
      try {
        const snapshot = await getDocs(collection(db, "combis"))
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setCombis(data)
      } catch (error) {
        console.error(error)
        setToast({ message: "Error cargando combis", type: "error" })
      }
      setLoading(false)
    }
    loadCombis()
  }, [])

  // 🔥 Cargar rutas desde Firestore
  useEffect(() => {
    async function loadRoutes() {
      try {
        const snapshot = await getDocs(collection(db, "rutas"))
        const data = snapshot.docs.map(doc => ({ id: doc.id, routeName: doc.data().routeName }))
        setRoutes(data)
      } catch (error) {
        console.error(error)
        setToast({ message: "Error cargando rutas", type: "error" })
      }
    }
    loadRoutes()
  }, [])

  const handleOpenModal = async (combi) => {
    // Forzar recarga de rutas cada vez que abres el modal
    try {
      const snapshot = await getDocs(collection(db, "rutas"))
      const data = snapshot.docs.map(doc => ({ id: doc.id, routeName: doc.data().routeName }))
      setRoutes(data)
    } catch (error) {
      console.error(error)
      setToast({ message: "Error cargando rutas", type: "error" })
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingCombi) {
        const ref = doc(db, "combis", editingCombi.id)
        await updateDoc(ref, formData)
        setCombis(combis.map(c => (c.id === editingCombi.id ? { ...c, ...formData } : c)))
        setToast({ message: "Combi actualizada", type: "success" })
      } else {
        const ref = await addDoc(collection(db, "combis"), formData)
        setCombis([...combis, { id: ref.id, ...formData }])
        setToast({ message: "Combi creada", type: "success" })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      setToast({ message: "Error al guardar combi", type: "error" })
    }
    setLoading(false)
  }

  const handleToggleActive = async (combi) => {
    try {
      const ref = doc(db, "combis", combi.id)
      await updateDoc(ref, { isActive: !combi.isActive })
      setCombis(combis.map(c => (c.id === combi.id ? { ...c, isActive: !c.isActive } : c)))
      setToast({
        message: `Combi ${!combi.isActive ? "activada" : "desactivada"}`,
        type: "success",
      })
    } catch (error) {
      console.error(error)
      setToast({ message: "Error al actualizar combi", type: "error" })
    }
  }

  // 🔹 Helper para mostrar nombre de ruta en la tabla
  const getRouteName = (routeId) => {
    const route = routes.find(r => r.id === routeId)
    return route ? route.routeName : routeId
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Combis</h2>
        <Button onClick={() => handleOpenModal()}>Crear Combi</Button>
      </div>

      <Table columns={["ID", "Ruta", "Placa", "Activa", "Acciones"]} loading={loading}>
        {combis.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
              No hay combis registradas
            </td>
          </tr>
        ) : (
          combis.map((combi) => (
            <tr key={combi.id} className="hover:bg-muted/50">
              <td className="px-4 py-3 text-sm">{combi.id.slice(0, 8)}</td>
              <td className="px-4 py-3 text-sm">{getRouteName(combi.routeId)}</td>
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
          ))
        )}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCombi ? "Editar Combi" : "Crear Combi"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Ruta</Label>
            <select
              className="w-full border border-input rounded-md p-2"
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
              required
            >
              <option value="">Selecciona una ruta</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.routeName}</option>
              ))}
            </select>
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
