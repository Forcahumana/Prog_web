'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Registar() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // POST direto para o endpoint de registro do Strapi
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const res = await fetch(`${apiUrl}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Erro ao registar.");
      } else {
        setSuccess("Registo realizado com sucesso!");
      }
    } catch {
      setError("Erro de rede.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-indigo-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-700">
          Criar Conta
        </h2>
        <input
          type="text"
          placeholder="Nome de utilizador"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-700"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-700"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-700"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-indigo-700"
        >
          Registar
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-200 text-indigo-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
          onClick={() => router.push('/admin')}
        >
          Voltar para Login
        </button>
        {error && (
          <div className="text-red-600 text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-600 text-center">{success}</div>
        )}
      </form>
    </main>
  );
}