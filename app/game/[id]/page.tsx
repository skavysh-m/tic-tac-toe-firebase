import { Suspense } from "react";
import GameClient from "./GameClient";

export default function GamePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading game...</div>}>
      <GameClient />
    </Suspense>
  );
}
