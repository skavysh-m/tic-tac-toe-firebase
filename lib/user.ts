import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export interface User {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  winRate?: number;
  createdAt: number;
  lastActiveAt?: number;
}

export async function createUser(name: string): Promise<User> {
  const now = Date.now();
  const userRef = await addDoc(collection(db, "users"), {
    name,
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0,
    createdAt: now,
    lastActiveAt: now,
  });
  return {
    id: userRef.id,
    name,
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0,
    createdAt: now,
    lastActiveAt: now,
  };
}

export async function getUser(id: string): Promise<User | null> {
  const userSnap = await getDoc(doc(db, "users", id));
  if (!userSnap.exists()) return null;
  return { id: userSnap.id, ...userSnap.data() } as User;
}

export async function updateUserStats(id: string, stats: Partial<User>) {
  await updateDoc(doc(db, "users", id), stats);
}

export async function getLeaderboard(top = 10): Promise<User[]> {
  const q = query(collection(db, "users"), orderBy("wins", "desc"), limit(top));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as User);
}
