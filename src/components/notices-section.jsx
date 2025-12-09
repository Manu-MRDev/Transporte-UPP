import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function NoticesSection() {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    const fetchNotices = async () => {
      const snapshot = await getDocs(collection(db, "avisos"))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setNotices(data)
    }
    fetchNotices()
  }, [])

  const getIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case "warning":
        return "destructive"
      case "info":
        return "secondary"
      case "success":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <section id="avisos" className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Avisos Importantes</h2>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(notice.priority)}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{notice.message}</p>
                  </div>
                </div>

                <Badge variant={getBadgeVariant(notice.priority)} className="shrink-0">
                  {notice.date || "Hoy"}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
