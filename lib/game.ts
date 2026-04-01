import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  runTransaction,
} from "firebase/firestore";

export type Game = {
  id: string;
  players: string[];
  board: string[];
  currentTurn: string;
  status: "waiting" | "playing" | "finished";
  winner?: string;
};

export async function createGame(playerId: string): Promise<Game> {
  const board = Array(9).fill("");
  const gameRef = await addDoc(collection(db, "games"), {
    players: [playerId],
    board,
    currentTurn: playerId,
    status: "waiting",
  });
  return {
    id: gameRef.id,
    players: [playerId],
    board,
    currentTurn: playerId,
    status: "waiting",
  };
}

export async function joinGame(gameId: string, playerId: string): Promise<Game | null> {
  const gameRef = doc(db, "games", gameId);

  return runTransaction(db, async (transaction) => {
    const snap = await transaction.get(gameRef);
    if (!snap.exists()) return null;

    const game = snap.data() as Game;

    if (game.players.length >= 2) return null;

    const updatedPlayers = [...game.players, playerId];

    const updatedGame: Game = {
      ...game,
      id: gameId,
      players: updatedPlayers,
      status: "playing",
      currentTurn: game.players[0],
      board: game.board ?? Array(9).fill(""),
    };

    transaction.update(gameRef, {
      players: updatedPlayers,
      status: "playing",
      currentTurn: updatedGame.currentTurn,
    });

    return updatedGame;
  });
}

export async function getGame(gameId: string): Promise<Game | null> {
  const gameSnap = await getDoc(doc(db, "games", gameId));
  if (!gameSnap.exists()) return null;
  return { id: gameSnap.id, ...gameSnap.data() } as Game;
}

export async function listWaitingGames(): Promise<Game[]> {
  const q = query(collection(db, "games"), where("status", "==", "waiting"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
}

export async function updateGame(gameId: string, data: Partial<Game>) {
  await updateDoc(doc(db, "games", gameId), data);
}
