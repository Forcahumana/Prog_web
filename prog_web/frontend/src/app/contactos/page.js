"use client";
import { useState } from "react";

export default function Contactos() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");
    try {
      const res = await fetch("http://localhost:1337/api/mensagens-de-contatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            nome,
            email,
            mensagem,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(<span style={{ color: "green" }}>Mensagem enviada com sucesso!</span>);
        setNome("");
        setEmail("");
        setMensagem("");
      } else {
        setStatus(data?.error?.message || <span style={{ color: "red" }}>Erro ao enviar mensagem.</span>);
      }
    } catch (err) {
      setStatus(<span style={{ color: "red" }}>Erro ao enviar mensagem.</span>);
    }
};

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 pb-20 rounded-b-3xl">
        <header className="max-w-6xl mx-auto flex justify-between items-center py-8 px-6">
          <span className="text-white font-bold text-2xl tracking-wide">NextEvent</span>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-white font-medium hover:underline">Home</a>
            <a href="/contactos" className="text-white font-medium underline">Contactos</a>
            <a href="/teste" className="text-white font-medium hover:underline">Administração</a>
          </nav>
        </header>
        {/* Welcome Section */}
        <section className="text-center mt-12">
          <h1 className="text-white text-5xl font-extrabold mb-4 drop-shadow-lg">
            Contactos
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            Entre em contacto connosco para dúvidas, sugestões ou suporte.
          </p>
        </section>
      </div>
      {/* Contact Info Section */}
      <section className="max-w-2xl mx-auto mt-5 px-6">
        <div className="bg-white rounded-xl shadow-lg p-12 flex flex-col gap-10 min-h-[550px]">
          <div>
            <h2 className="text-2xl font-bold text-indigo-700 mb-2">Formulário de Contacto</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label htmlFor="nome" className="text-gray-800">Nome:</label>
              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
                className="border rounded-lg px-4 py-2 placeholder-gray-300"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
              <label htmlFor="email" className="text-gray-800">Email:</label>
              <input
                id="email"
                type="email"
                placeholder="Seu email"
                className="border rounded-lg px-4 py-2 placeholder-gray-300"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <label htmlFor="mensagem" className="text-gray-800">Mensagem:</label>
              <textarea
                id="mensagem"
                placeholder="Sua mensagem"
                className="border rounded-lg px-4 py-2 placeholder-gray-300"
                rows={6}
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Enviar
              </button>
              {status && (
                <span className="text-sm mt-2 text-center">{status}</span>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
