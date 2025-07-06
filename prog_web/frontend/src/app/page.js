"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [eventos, setEventos] = useState([]);

  // Atualiza a cada 5 segundos para verificar se ha mudanças
  useEffect(() => {
    let isMounted = true;
    const fetchEventos = async () => {
      const res = await fetch('http://localhost:1337/api/eventos');
      const json = await res.json();
      if (isMounted) setEventos(Array.isArray(json?.data) ? json.data : []);
    };
    fetchEventos();
    const interval = setInterval(fetchEventos, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleJoinEvent = async () => {
    const nome = prompt("Qual é o seu nome?");
    if (!nome) return;
    const email = prompt("Qual é o seu email?");
    if (!email) return;
    if (eventos.length === 0) {
      alert("Nenhum evento disponível.");
      return;
    }
    const eventoNomes = eventos.map((ev, idx) =>
      `${idx + 1}: ${ev.nome || ev.attributes?.name || "Sem nome"}`
    ).join('\n');
    const escolha = prompt(`Digite o número do evento que deseja participar:\n${eventoNomes}`);
    const idx = parseInt(escolha, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= eventos.length) {
      alert("Evento inválido.");
      return;
    }
    const evento = eventos[idx];
    alert(`Inscrição enviada!\nNome: ${nome}\nEmail: ${email}\nEvento: ${evento.nome || evento.attributes?.name}`);
    // Aqui você pode enviar os dados para o backend se desejar
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 pb-20 rounded-b-3xl">
          <header className="max-w-6xl mx-auto flex justify-between items-center py-8 px-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/DataMarcadaLogo.png"
                alt="DataMarcadaLogo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-white font-bold text-2xl tracking-wide">DataMarcada</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-white font-medium hover:underline">Home</a>
              <a href="/contactos" className="text-white font-medium hover:underline">Contactos</a>
              <a href="/teste" className="text-white font-medium hover:underline">Administração</a>
            </nav>
          </header>
          {/* Welcome Section */}
        <section className="text-center mt-12 flex flex-col items-center">
        <img
          src="/assets/DataMarcadaLogo.png"
          alt="DataMarcada Logo"
          className="h-24 w-24 object-contain mb-6"
         />
         <h1 className="text-white text-5xl font-extrabold mb-4 drop-shadow-lg">
            DataMarcada
         </h1>
        <p className="text-indigo-100 text-lg mb-8">
          Inscreva-se nos nossos eventos, cursos, workshops e mais.
        </p>
      </section>
      </div>
      {/* Popular Events Section */}
      <section className="max-w-6xl mx-auto mt-16 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center md:text-left">
            Eventos A Decorrerem
          </h2>
          <button
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition text-lg shadow"
            onClick={handleJoinEvent}
          >
            Inscrever-se em um Evento
          </button>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-white rounded-xl shadow-lg p-8 w-80 min-h-48 flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-xl mb-1 text-indigo-700">
                    {evento.nome || evento.attributes?.name || "Sem nome"}
                  </div>
                  <div className="text-gray-500 text-sm mb-4">
                    {evento.data || evento.attributes?.date
                      ? new Date(evento.data || evento.attributes?.date).toLocaleDateString('pt-PT')
                      : "Sem data"}
                    {" "}
                    {evento.hora &&
                      <span>
                        | {new Date(`1970-01-01T${evento.hora}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    }
                  </div>
                  <div className="mb-3">
                    <span className="block text-gray-700 font-semibold">Descrição:</span>
                    <span className="text-gray-800">{evento.descricao || evento.attributes?.description || "Sem descrição"}</span>
                  </div>
                  <div className="mb-3">
                    <span className="block text-gray-700 font-semibold">Local:</span>
                    <span className="text-gray-800">{evento.local || "Não definido"}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-4">
                  <div>
                    <span className="font-semibold text-gray-700">Vagas:</span>{" "}
                    {(evento.vagas_ocupadas ?? 0) >= (evento.vagas_totais ?? 0)
                      ? <span className="text-gray-800">Cheio</span>
                      : <span className="text-gray-800">{evento.vagas_ocupadas ?? 0} / {evento.vagas_totais ?? 0}</span>
                    }
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Status:</span>{" "}
                    <span className="text-gray-800">{evento.statu_s || evento.attributes?.status || "Sem status"}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Nenhum evento encontrado.</div>
          )}
        </div>
      </section>
    </main>
  );
}
