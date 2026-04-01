"use client";
import { createGame, joinGame, listWaitingGames } from "../../lib/game";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../../lib/user";

export default function GameActions({ user }: { user: User }) {
  const [gameLoading, setGameLoading] = useState(false);
  const router = useRouter();

  async function handleStartGame() {
    setGameLoading(true);
    const game = await createGame(user.id);
    setGameLoading(false);
    router.push(`/game/${game.id}?user=${user.id}`);
  }

  async function handleJoinGame() {
    setGameLoading(true);
    const waiting = await listWaitingGames();
    if (waiting.length === 0) {
      setGameLoading(false);
      alert("No games to join. Start a new game instead.");
      return;
    }
    const game = await joinGame(waiting[0].id, user.id);
    setGameLoading(false);
    if (game) {
      router.push(`/game/${game.id}?user=${user.id}`);
    } else {
      alert("Failed to join game.");
    }
  }

  return (
    <div className="mb-6">
      <div className="mb-2 text-gray-700">Your nickname: <b>{user.name}</b></div>
      <div className="flex gap-4">
        <button
          onClick={handleStartGame}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={gameLoading}
        >
          {gameLoading ? "Starting..." : "Start New Game"}
        </button>
        <button
          onClick={handleJoinGame}
          className="bg-purple-500 text-white px-4 py-2 rounded"
          disabled={gameLoading}
        >
          {gameLoading ? "Joining..." : "Join Waiting Game"}
        </button>
      </div>
    </div>
  );
}
