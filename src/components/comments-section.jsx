"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, ThumbsUp, User } from "lucide-react"

import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment
} from "firebase/firestore"

export function CommentsSection() {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([])

  // 🔥 Cargar comentarios desde Firestore
  useEffect(() => {
    async function loadComments() {
      const snapshot = await getDocs(collection(db, "comments"))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Ordenar por fecha descendente
      data.sort((a, b) => b.timestamp - a.timestamp)

      setComments(data)
    }
    loadComments()
  }, [])

  // 📝 Publicar comentario
  const handlePublish = async () => {
    if (!newComment.trim()) return

    const commentData = {
      author: "Usuario",
      content: newComment,
      likes: 0,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString(),
    }

    const ref = await addDoc(collection(db, "comments"), commentData)

    setComments([{ id: ref.id, ...commentData }, ...comments])
    setNewComment("")
  }

  // 👍 Dar like
  const handleLike = async (id) => {
    const ref = doc(db, "comments", id)
    await updateDoc(ref, { likes: increment(1) })

    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, likes: c.likes + 1 } : c
      )
    )
  }

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
            <Button onClick={handlePublish}>Publicar Comentario</Button>
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
                    <span className="text-sm text-muted-foreground">
                      {comment.date}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {comment.content}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleLike(comment.id)}
                  >
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
