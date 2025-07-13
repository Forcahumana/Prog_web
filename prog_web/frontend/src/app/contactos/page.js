"use client";

import { useState } from "react";

export default function Contactos() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState("");

  // Função que trata o envio do formulário de contacto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");
    try {
      // Envia os dados do formulário para o endpoint do Strapi
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const res = await fetch(`${apiUrl}/api/mensagens-de-contatos`, {
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
      // Se o envio for bem-sucedido, mostra mensagem de sucesso e limpa os campos
      if (res.ok) {
        setStatus(<span style={{ color: "green" }}>Mensagem enviada com sucesso!</span>);
        setNome("");
        setEmail("");
        setMensagem("");
      } else {
        // Se houver erro, mostra mensagem de erro
        setStatus(data?.error?.message || <span style={{ color: "red" }}>Erro ao enviar mensagem.</span>);
      }
    } catch (err) {
      // No caso de ocorrer erro de rede ou inesperado
      setStatus(<span style={{ color: "red" }}>Erro ao enviar mensagem.</span>);
    }
  };

  // Pagina de contactos
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 font-sans pb-10">
      {/* Header com sombra e blur */}
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 pb-20 rounded-b-3xl shadow-lg backdrop-blur-md">
        <header className="max-w-6xl mx-auto flex justify-between items-center py-8 px-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/DataMarcadaLogo.png"
              alt="DataMarcadaLogo"
              className="h-12 w-12 object-contain drop-shadow-lg"
            />
            <span className="text-white font-extrabold text-3xl tracking-wide drop-shadow-lg">DataMarcada</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="/" className="text-white font-semibold hover:underline hover:text-indigo-200 transition">Home</a>
            <a href="#" className="text-white font-semibold hover:underline hover:text-indigo-200 transition">Contactos</a>
            <a href="/admin" className="text-white font-semibold hover:underline hover:text-indigo-200 transition">Administração</a>
          </nav>
        </header>
        {/* Secção de boas-vindas */}
        <section className="text-center mt-12 flex flex-col items-center">
          <img
            src="/assets/DataMarcadaLogo.png"
            alt="DataMarcada Logo"
            className="h-28 w-28 object-contain mb-6 drop-shadow-xl"
          />
          <h1 className="text-white text-6xl font-extrabold mb-4 drop-shadow-2xl tracking-tight">
            Contactos
          </h1>
          <p className="text-indigo-100 text-2xl mb-8 max-w-2xl drop-shadow">
            Entre em contacto connosco para dúvidas, sugestões ou suporte.
          </p>
        </section>
      </div>
      {/* Formulário de contacto */}
      <section className="max-w-2xl mx-auto mt-16 px-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 flex flex-col gap-10 min-h-[550px] border border-indigo-100">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center drop-shadow">Formulário de Contacto</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome" className="text-gray-800 font-semibold block mb-1">Nome:</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="O seu nome"
                  className="border rounded-lg px-4 py-3 placeholder-gray-400 text-gray-900 w-full focus:ring-2 focus:ring-indigo-400 transition"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="text-gray-800 font-semibold block mb-1">Email:</label>
                <input
                  id="email"
                  type="email"
                  placeholder="O seu email"
                  className="border rounded-lg px-4 py-3 placeholder-gray-400 text-gray-900 w-full focus:ring-2 focus:ring-indigo-400 transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="mensagem" className="text-gray-800 font-semibold block mb-1">Mensagem:</label>
                <textarea
                  id="mensagem"
                  placeholder="A sua mensagem"
                  className="border rounded-lg px-4 py-3 placeholder-gray-400 text-gray-900 w-full focus:ring-2 focus:ring-indigo-400 transition"
                  rows={6}
                  value={mensagem}
                  onChange={e => setMensagem(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-bold py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-500 transition text-lg shadow-lg"
              >
                Enviar
              </button>
              {/* Aqui mostra se houve algum erro ou se foi sucedido */}
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