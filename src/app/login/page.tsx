"use client";
import { useState } from "react";

export default function LoginPage() {
  const [passcode, setPasscode] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      setMsg("Authenticated. Redirecting...");
      window.location.href = "/";
    } else {
      setMsg("Invalid passcode");
    }
  }

  return (
    <main className="p-6">
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Enter passcode"
          className="border p-2"
        />
        <button type="submit" className="ml-2 p-2 border">
          Enter
        </button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
