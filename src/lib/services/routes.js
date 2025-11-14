// /lib/services/routes.js
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function getRoutes() {
  const ref = collection(db, "routes");
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
