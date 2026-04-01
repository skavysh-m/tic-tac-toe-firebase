"use client";
import { User } from "../../lib/user";

export default function Leaderboard({ leaderboard }: { leaderboard: User[] }) {
  if (leaderboard.length === 0) return null;
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
      <ol>
        {leaderboard.map((u) => (
          <li key={u.id}>
            {u.name} - Wins: {u.wins}
          </li>
        ))}
      </ol>
    </div>
  );
}
