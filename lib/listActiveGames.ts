import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Game } from "../lib/game";

export async function listActiveGames(): Promise<Game[]> {
  const q = query(collection(db, "games"), where("status", "==", "playing"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
}
