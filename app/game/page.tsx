"use client";
import { useEffect, useState } from "react";
import { getGame, updateGame, Game } from "../../lib/game";
import { getUser, updateUserStats, User } from "../../lib/user";
import { useRouter, useSearchParams } from "next/navigation";

type GameStatus = "waiting" | "playing" | "finished";

function checkWinner(board: string[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default function GamePage() {
  const router = useRouter();
  const params = useSearchParams();
  const gameId = params.get("id");
  const userId = params.get("user");
  const [game, setGame] = useState<Game | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  //

  useEffect(() => {
    async function load() {
      if (!gameId || !userId) return;
      setLoading(true);
      const g = await getGame(gameId);
      setGame(g);
      setUser(await getUser(userId));
      setLoading(false);
    }
    load();
  }, [gameId, userId]);

  async function handleMove(idx: number) {
    if (!game || !user) return;
    if (game.status !== "playing" || game.board[idx]) return;
    if (game.currentTurn !== user.id) return;
    const symbol = game.players[0] === user.id ? "X" : "O";
    const newBoard = [...game.board];
    newBoard[idx] = symbol;
    const winnerSymbol = checkWinner(newBoard);
    let status: GameStatus = game.status;
    let winner = undefined;
    if (winnerSymbol) {
      status = "finished";
      winner = user.id;
      // Update user stats
      await updateUserStats(user.id, { wins: (user.wins || 0) + 1, gamesPlayed: (user.gamesPlayed || 0) + 1 });
      const otherId = game.players.find((p) => p !== user.id);
      if (otherId) {
        const other = await getUser(otherId);
        if (other) await updateUserStats(other.id, { losses: (other.losses || 0) + 1, gamesPlayed: (other.gamesPlayed || 0) + 1 });
      }
    } else if (newBoard.every((c) => c)) {
      status = "finished";
      // Draw
      await updateUserStats(user.id, { draws: (user.draws || 0) + 1, gamesPlayed: (user.gamesPlayed || 0) + 1 });
      const otherId = game.players.find((p) => p !== user.id);
      if (otherId) {
        const other = await getUser(otherId);
        if (other) await updateUserStats(other.id, { draws: (other.draws || 0) + 1, gamesPlayed: (other.gamesPlayed || 0) + 1 });
      }
    }
    await updateGame(game.id, {
      board: newBoard,
      currentTurn: game.players.find((p) => p !== game.currentTurn),
      status,
      winner,
    });
    setGame(await getGame(game.id));
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!game || !user) return <div className="p-8">Game or user not found.</div>;

  const symbol = game.players[0] === user.id ? "X" : "O";
  const otherSymbol = symbol === "X" ? "O" : "X";
  const isMyTurn = game.currentTurn === user.id && game.status === "playing";

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tic-Tac-Toe Game</h1>
      <div className="mb-2">You are: <b>{symbol}</b></div>
      <div className="mb-2">Opponent: <b>{otherSymbol}</b></div>
      <div className="mb-2">Status: <b>{game.status}</b></div>
      {game.status === "playing" && (
        <div className="mb-2">{isMyTurn ? "Your turn!" : "Opponent's turn..."}</div>
      )}
      <div className="grid grid-cols-3 gap-2 w-48 mb-4">
        {game.board.map((cell, idx) => (
          <button
            key={idx}
            className="w-16 h-16 text-3xl border bg-white"
            disabled={!!cell || !isMyTurn || game.status !== "playing"}
            onClick={() => handleMove(idx)}
          >
            {cell}
          </button>
        ))}
      </div>
      {game.status === "finished" && (
        <div className="mb-4 font-semibold">
          {game.winner
            ? game.winner === user.id
              ? "You win!"
              : "You lose!"
            : "Draw!"}
        </div>
      )}
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => router.push("/")}>Back to Home</button>
    </main>
  );
}
