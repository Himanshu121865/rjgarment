"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function AdminLogin({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });
    if (res.ok) {
      onLogin(input);
      sessionStorage.setItem("admin_token", input);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md border-8 border-[#ff4800] bg-white p-12 shadow-[24px_24px_0px_0px_#ff4800]"
      >
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Lock size={40} className="text-black" />
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
              Admin
              <br />
              Access
            </h1>
          </div>
          <div className="w-full h-2 bg-[#ff4800]" />
        </div>

        <label className="block font-mono text-xs font-bold uppercase tracking-widest mb-2 text-black">
          Password
        </label>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border-4 border-black p-4 font-mono text-lg uppercase bg-transparent text-black placeholder:text-gray-400 focus:outline-none focus:border-[#ff4800] transition-colors"
          placeholder="ENTER PASSWORD"
          autoFocus
        />

        {error && (
          <p className="mt-3 font-black text-sm uppercase text-[#ff4800]">
            Access Denied
          </p>
        )}

        <motion.button
          whileHover={{
            scale: 1.02,
            x: -3,
            y: -3,
            boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="mt-6 w-full border-4 border-black bg-[#ff4800] p-4 font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          Unlock
        </motion.button>

        <p className="mt-6 font-mono text-xs text-gray-500 uppercase tracking-wider text-center">
          RJ GARMENT · Admin Panel
        </p>
      </motion.form>
    </div>
  );
}
