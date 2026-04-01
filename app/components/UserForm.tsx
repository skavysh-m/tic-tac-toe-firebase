"use client";
import { useState } from "react";
import { createUser, User } from "../../lib/user";
import { findUserByName } from "../../lib/findUserByName";

export default function UserForm({ onLogin }: { onLogin: (user: User) => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const existing = await findUserByName(name);
    if (existing) {
      onLogin(existing);
      setLoading(false);
      return;
    }
    const u = await createUser(name);
    onLogin(u);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your name"
        className="border p-2 mr-2"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
