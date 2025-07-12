'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventos, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // --- Core Functions (Login, Logout, Fetching) ---

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setIsLoggedIn(true);
      fetchEvents();
    }
  }, []);

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('jwt', data.jwt);
        setIsLoggedIn(true);
        fetchEvents();
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const res = await fetch(`${apiUrl}/api/eventos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        setError('Sessão expirada. Faça login novamente.');
        return;
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Falha ao carregar eventos');
      }
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    router.push('/');
  };

  // --- Login Form Component ---
  function LoginForm({ onLogin, isLoading, error }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
      e.preventDefault();
      onLogin({ identifier, password });
    };
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Email:</label>
              <input type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="admin@exemplo.com" disabled={isLoading} />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg" placeholder="••••••••" disabled={isLoading} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Main Component Render ---

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
            Logout
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando eventos...</p>
          </div>
        ) : (
<div className="flex flex-wrap gap-8 justify-center">
  {eventos.length > 0 ? (
    eventos.map((evento) => (
      <div key={evento.id} className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col">
        {/* Event Info */}
        <div className="flex-grow">
          {/* FIX: Changed to use the correct field names from Strapi */}
          <div className="font-bold text-xl mb-1 text-indigo-700">{evento.nome || 'Evento sem nome'}</div>
          <div className="text-gray-500 text-sm mb-4">
            {evento.data ? new Date(evento.data).toLocaleDateString('pt-PT') : "Sem data"}
            {" "}
            {evento.hora &&
            <span>
            | {new Date(`1970-01-01T${evento.hora}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
            }
          </div>
          <span className="block text-gray-700 font-semibold">Descrição:</span>
          <p className="text-gray-700 mb-4">{evento.descricao || 'Sem descrição'}</p>
          <div>
          <div className="mb-3">
            <span className="block text-gray-700 font-semibold">Local:</span>
            <span className="text-gray-800">{evento.local || "Não definido"}</span>
          </div>
          <span className="font-semibold text-gray-700">Vagas:</span>
          {
            (evento.vagas_ocupadas ?? 0) >= (evento.vagas_totais ?? 0)
            ? <span className="text-gray-800"> Cheio</span>
            : <span className="text-gray-800"> {evento.vagas_ocupadas ?? 0} / {evento.vagas_totais ?? 0}</span>
          }
          </div>
          <div>
            <span className="font-semibold text-gray-700">Status:</span>
            <span className="font-semibold text-gray-700"></span>{" "}
            <span className="text-gray-800">{evento.statu_s || "Sem status"}</span>
          </div>
        </div>
        {/* Admin Action Buttons */}
        <div className="border-t mt-4 pt-4 flex justify-end gap-3">
          <button className="text-indigo-600 hover:text-indigo-900 font-semibold">Editar</button>
          <button className="text-red-600 hover:text-red-900 font-semibold">Deletar</button>
        </div>
      </div>
    ))
  ) : (
    <div className="text-gray-500 w-full text-center py-10">Nenhum evento encontrado.</div>
  )}
</div>
        )}
      </div>
    </div>
  );
}