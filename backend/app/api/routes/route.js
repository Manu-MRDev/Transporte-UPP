// /app/api/routes/route.js
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await db.collection("routes").get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching routes" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const ref = await db.collection("routes").add({
      name: data.name,
      color: data.color || "#000",
      isActive: true,
      createdAt: new Date()
    });

    return Response.json({ id: ref.id }, { status: 201 });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error creating route" }, { status: 500 });
  }
}
