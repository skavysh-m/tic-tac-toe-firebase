"use client";

import { useState } from "react";
import { listActiveGames } from "../lib/listActiveGames";
import { getLeaderboard, getUser, User } from "../lib/user";
import { useRouter } from "next/navigation";
import { Game, listWaitingGames } from "@/lib/game";
import Leaderboard from "./components/Leaderboard";
import GameList from "./components/GameList";
import GameActions from "./components/GameActions";
import UserForm from "./components/UserForm";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [waitingGames, setWaitingGames] = useState<Game[]>([]);
  const [activeGames, setActiveGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [playerNames, setPlayerNames] = useState<{ [id: string]: string }>({});

  const router = useRouter();

  async function fetchGames() {
    setGamesLoading(true);

    const [waiting, active] = await Promise.all([
      listWaitingGames(),
      listActiveGames(),
    ]);

    setWaitingGames(waiting);
    setActiveGames(active);

    const ids = Array.from(
      new Set([...waiting, ...active].flatMap((g) => g.players))
    );

    const names: { [id: string]: string } = {};

    await Promise.all(
      ids.map(async (id) => {
        const u = await getUser(id);
        if (u) names[id] = u.name;
      })
    );

    setPlayerNames(names);
    setGamesLoading(false);
  }

  function handleLogin(u: User) {
    setUser(u);
  }

  async function fetchLeaderboard() {
    setLoading(true);
    setLeaderboard(await getLeaderboard());
    setLoading(false);
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tic-Tac-Toe</h1>

      {!user ? (
        <UserForm onLogin={handleLogin} />
      ) : (
        <div className="mb-6">Welcome, {user.name}!</div>
      )}

      {user && <GameActions user={user} />}

      <button
        onClick={fetchGames}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
        disabled={gamesLoading}
      >
        {gamesLoading ? "Loading Games..." : "Show Games"}
      </button>

      <GameList
        waitingGames={waitingGames}
        activeGames={activeGames}
        playerNames={playerNames}
      />

      <button
        onClick={fetchLeaderboard}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Show Leaderboard"}
      </button>

      <button
        onClick={() => router.push("/leaderboard")}
        className="mb-4 bg-gray-500 text-white px-4 py-2 rounded ml-2"
      >
        Leaderboard Page
      </button>

      <Leaderboard leaderboard={leaderboard} />
    </main>
  );
}