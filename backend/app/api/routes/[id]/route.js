// /app/api/routes/[id]/route.js
import { db } from "@/lib/firebaseAdmin";

export async function PUT(req, { params }) {
  try {
    const data = await req.json();
    await db.collection("routes").doc(params.id).update(data);

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error updating route" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await db.collection("routes").doc(params.id).delete();
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error deleting route" }, { status: 500 });
  }
}
