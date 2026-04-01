import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { User } from "../lib/user";

export async function findUserByName(name: string): Promise<User | null> {
  const q = query(collection(db, "users"), where("name", "==", name));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as User;
}
