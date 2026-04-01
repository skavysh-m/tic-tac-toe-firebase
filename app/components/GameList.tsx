"use client";
import { Game } from "../../lib/game";

export default function GameList({ waitingGames, activeGames, playerNames }: {
  waitingGames: Game[];
  activeGames: Game[];
  playerNames: { [id: string]: string };
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Games</h2>
      {waitingGames.length > 0 && (
        <div className="mb-2">
          <div className="font-medium">Waiting Games:</div>
          <ul>
            {waitingGames.map(g => (
              <li key={g.id}>
                {g.players.map(pid => playerNames[pid] || pid).join(" vs ")}
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeGames.length > 0 && (
        <div>
          <div className="font-medium">Active Games:</div>
          <ul>
            {activeGames.map(g => (
              <li key={g.id}>
                {g.players.map(pid => playerNames[pid] || pid).join(" vs ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
