"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [eventos, setEventos] = useState([]);

  // Atualiza os dados a cada 5 segundos
  useEffect(() => {
    let isMounted = true;
    // Buscar eventos do backend
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

  // Inscrição num evento
  const handleJoinEvent = async () => {
    const nome = prompt("Qual é o seu nome?");
    if (!nome) return;
    let email = prompt("Qual é o seu email?");
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    const eventosDisponiveis = eventos.filter(ev => {
      const vagasTotais = ev.vagas_totais ?? ev.attributes?.vagas_totais ?? 0;
      const vagasOcupadas = ev.vagas_ocupadas ?? ev.attributes?.vagas_ocupadas ?? 0;
      return vagasOcupadas < vagasTotais;
    });

    if (eventosDisponiveis.length === 0) {
      alert("Nenhum evento disponível com vagas.");
      return;
    }

    const eventoNomes = eventosDisponiveis.map((ev, idx) =>
      `${idx + 1}: ${ev.attributes?.name || ev.nome || "Sem nome"}`
    ).join('\n');

    const escolha = prompt(`Digite o número do evento que deseja participar:\n${eventoNomes}`);
    const idx = parseInt(escolha, 10) - 1;

    if (isNaN(idx) || idx < 0 || idx >= eventosDisponiveis.length) {
      alert("Evento inválido.");
      return;
    }

    const evento = eventosDisponiveis[idx];
    const eventoNome = evento.attributes?.name || evento.nome;
    const eventoDocumentId = evento.documentId ?? evento.id;

    const postData = {
      data: {
        nome_cliente: nome,
        email_cliente: email,
        evento: eventoDocumentId,
        statu_s: 'pendente'
      }
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const response = await fetch(`${apiUrl}/api/inscricaos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Ocorreu um erro ao enviar a sua inscrição. (Status: ${response.status})`);
      }

      alert(`Inscrição para o evento "${eventoNome}" realizada com sucesso!`);
    } catch (error) {
      console.error('Failed to submit subscription:', error);
      alert(error.message || "Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    }

    setEventos(prevEventos =>
      prevEventos.map(ev =>
        (ev.documentId ?? ev.id) === eventoDocumentId
          ? {
              ...ev,
              vagas_ocupadas:
                (ev.vagas_ocupadas ?? ev.attributes?.vagas_ocupadas ?? 0) + 1
            }
          : ev
      )
    );

    const vagasAtualizadas = (evento.vagas_ocupadas ?? evento.attributes?.vagas_ocupadas ?? 0) + 1;
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
    await fetch(`${apiUrl}/api/eventos/${eventoDocumentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          vagas_ocupadas: vagasAtualizadas
        }
      })
    });
  };

  // Pagina principal
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 font-sans pb-10">
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
            <a href="#" className="text-white font-semibold hover:underline hover:text-indigo-200 transition">Home</a>
            <a href="/contactos" className="text-white font-semibold hover:underline hover:text-indigo-200 transition">Contactos</a>
            <a href="/admin" className="text-white font-semibold hover:underline hover:text-indigo-200 transition">Administração</a>
          </nav>
        </header>
        <section className="text-center mt-12 flex flex-col items-center">
          <img
            src="/assets/DataMarcadaLogo.png"
            alt="DataMarcada Logo"
            className="h-28 w-28 object-contain mb-6 drop-shadow-xl"
          />
          <h1 className="text-white text-6xl font-extrabold mb-4 drop-shadow-2xl tracking-tight">
            DataMarcada
          </h1>
          <p className="text-indigo-100 text-2xl mb-8 max-w-2xl drop-shadow">
            Inscreva-se nos nossos eventos, cursos, workshops e muito mais. Participe e marque a diferença.
          </p>
        </section>
      </div>
      {/* Eventos */}
      <section className="max-w-6xl mx-auto mt-16 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <h2 className="text-4xl font-bold text-indigo-800 text-center md:text-left drop-shadow">
            Eventos a Decorrer
          </h2>
          <button
            className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white font-bold py-3 px-8 rounded-xl"
            onClick={handleJoinEvent}
          >
            Inscrever-se num Evento
          </button>
        </div>
        {/* Lista de eventos */}
        <div className="flex flex-wrap gap-10 justify-center">
          {eventos.length > 0 ? (
            eventos.map((evento) => (
              <div
                key={evento.id}
                className="bg-white rounded-2xl shadow-xl p-8 w-80 min-h-56 flex flex-col justify-between border border-indigo-100"
              >
                <div>
                  <div className="font-bold text-2xl mb-1 text-indigo-700 drop-shadow">{evento.nome || evento.attributes?.name || "Sem nome"}</div>
                  <div className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                    <span>
                      {evento.data || evento.attributes?.date
                        ? new Date(evento.data || evento.attributes?.date).toLocaleDateString('pt-PT')
                        : "Sem data"}
                    </span>
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
                      ? <span className="text-gray-700">Cheio</span>
                      : <span className="text-gray-700">{evento.vagas_ocupadas ?? 0} / {evento.vagas_totais ?? 0}</span>
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
            <div className="text-gray-500 text-xl text-center py-10">Nenhum evento encontrado.</div>
          )}
        </div>
      </section>
    </main>
  );
}
