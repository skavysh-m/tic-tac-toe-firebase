import { getLeaderboard } from "../../lib/user";

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboard();
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <ol>
        {leaderboard.map((u) => (
          <li key={u.id}>
            {u.name} - Wins: {u.wins} | Games: {u.gamesPlayed} | Draws: {u.draws}
          </li>
        ))}
      </ol>
    </main>
  );
}
