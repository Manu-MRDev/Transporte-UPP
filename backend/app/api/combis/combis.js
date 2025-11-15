import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await db.collection("combis").get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error fetching combis" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const ref = await db.collection("combis").add({
      routeNumber: data.routeNumber || "",
      routeName: data.routeName || "",
      color: data.color || "primary",
      frequency: data.frequency || "",
      operatingHours: data.operatingHours || "",
      stops: data.stops || [],
      price: data.price || "",
      priceNote: data.priceNote || "",
      isActive: true,
      createdAt: new Date()
    });

    return Response.json({ id: ref.id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error creating combi" }, { status: 500 });
  }
}
