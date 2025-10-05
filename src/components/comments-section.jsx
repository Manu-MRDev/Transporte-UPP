"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ThumbsUp, User } from "lucide-react"
import { useState } from "react"

export function CommentsSection() {
  const [newComment, setNewComment] = useState("")

  const comments = [
    {
      id: 1,
      author: "María González",
      date: "2 horas",
      content: "Excelente servicio en la ruta . Siempre puntual y los conductores muy amables.",
      likes: 12,
    },
    {
      id: 2,
      author: "Carlos Ramírez",
      date: "5 horas",
      content: "Sería genial si pudieran agregar más unidades.",
      likes: 8,
    },
    {
      id: 3,
      author: "Ana Martínez",
      date: "1 día",
      content: "Gracias por el servicio!",
      likes: 15,
    },
  ]

  return (
    <section id="comentarios" className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Comentarios y Sugerencias</h2>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Deja tu comentario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Comparte tu experiencia o sugerencias..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-24"
          />
          <div className="flex justify-end">
            <Button>Publicar Comentario</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary rounded-full p-3">
                  <User className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-sm text-muted-foreground">hace {comment.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{comment.content}</p>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
