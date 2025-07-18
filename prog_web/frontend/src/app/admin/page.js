'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  // State para login, eventos, loading, erro, edição e criação de eventos
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [eventos, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    nome: "",
    descricao: "",
    local: "",
    data: "",
    hora: "",
    vagas_totais: 1,
    vagas_ocupadas: 0,
    statu_s: "ativo"
  }); //dados dos eventos
  const router = useRouter();

  // Funções principais: Login, Logout, Carregar eventos
  useEffect(() => {
    // Verifica se o user já está logged in
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setIsLoggedIn(true);
      fetchEvents();
    }
  }, []);

  // Função para login do admin
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

  // Função para carregar os eventos do strapi
  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('jwt');
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const res = await fetch(`${apiUrl}/api/eventos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Se o token expirou, faz logout
      if (res.statu_s === 401) {
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

  // Função para logout do admin
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false);
    router.push('/');
  };

  // Função para eliminar um evento
  const handleDelete = async (documentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento?')) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const res = await fetch(`${apiUrl}/api/eventos/${documentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Falha ao deletar evento');
      fetchEvents(); // Atualiza a lista de eventos
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de editar eventos
  const handleSaveEdit = async () => {
    if (!editingEvent) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      
      const res = await fetch(`${apiUrl}/api/eventos/${editingEvent.documentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            nome: editingEvent.nome,
            descricao: editingEvent.descricao,
            local: editingEvent.local,
            data: editingEvent.data,
            hora: editingEvent.hora,
            vagas_totais: editingEvent.vagas_totais,
            statu_s: editingEvent.statu_s
          }
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Falha ao atualizar evento');
      }
      
      setEditingEvent(null);
      fetchEvents(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para adicionar um novo evento
  const handleAddEvent = async () => {
    setIsLoading(true);
    setError("");
    if (!newEvent.nome) {
      setError("O campo 'nome' é obrigatório.");
      setIsLoading(false);
      return;
    }
    let horaFormatada = newEvent.hora;
    if (horaFormatada && horaFormatada.length === 5) {
      horaFormatada = `${horaFormatada}:00.000`;
    }

    try {
      const token = localStorage.getItem('jwt');
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
      const res = await fetch(`${apiUrl}/api/eventos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            ...newEvent,
            hora: horaFormatada
          }
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Falha ao criar evento');
      }

      setShowAddEvent(false);
      setNewEvent({
        nome: "",
        descricao: "",
        local: "",
        data: "",
        hora: "",
        vagas_totais: 1,
        vagas_ocupadas: 0,
        statu_s: "ativo"
      });
      fetchEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Formulário de login para admin
  function LoginForm({ onLogin, isLoading, error }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleSubmit = (e) => {
      e.preventDefault();
      onLogin({ identifier, password });
    };
    return (
      <div className="min-h-screen bg-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-300"
                placeholder="admin@exemplo.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-300"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 font-semibold">
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <button
            type="button"
            className="w-full mt-4 bg-gray-200 text-indigo-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-semibold"
            onClick={() => router.push('/registar')}
          >
            Criar Conta
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) { // Se o user não estiver logged in, mostra a pagina de login
    return <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />;
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    // painel de admin
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 font-sans pb-10">
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/')}
                className=" text-indigo-700 py-2 px-4 rounded-lg hover:underline font-semibold"
              >
                Voltar à Página Principal
              </button>
              <button
                onClick={() => setShowAddEvent(true)}
                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Adicionar Evento
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
              {/* Botão para voltar à página principal */}
            </div>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

          {/* Adicionar evento */}
          {showAddEvent && (
            <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 font-sans flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Adicionar Evento</h2>
                <div className="space-y-4">

                  <div>
                    <label className="block text-gray-700 mb-1">Título:</label>
                    <input
                      type="text"
                      value={newEvent.nome}
                      onChange={(e) => setNewEvent({ ...newEvent, nome: e.target.value })}
                      className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      placeholder="Título do evento"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Descrição:</label>
                    <textarea
                      value={newEvent.descricao}
                      onChange={(e) => setNewEvent({ ...newEvent, descricao: e.target.value })}
                      className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      rows="3"
                      placeholder="Descrição do evento"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Local:</label>
                    <input
                      type="text"
                      value={newEvent.local}
                      onChange={(e) => setNewEvent({ ...newEvent, local: e.target.value })}
                      className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      placeholder="Local do evento"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Data:</label>
                      <input
                        type="date"
                        value={newEvent.data}
                        onChange={(e) => setNewEvent({ ...newEvent, data: e.target.value })}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Hora:</label>
                      <input
                        type="time"
                        value={newEvent.hora}
                        onChange={(e) => setNewEvent({ ...newEvent, hora: e.target.value })}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Vagas Totais:</label>
                      <input
                        type="number"
                        value={newEvent.vagas_totais}
                        onChange={(e) => setNewEvent({ ...newEvent, vagas_totais: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Status:</label>
                      <select
                        value={newEvent.statu_s}
                        onChange={(e) => setNewEvent({ ...newEvent, statu_s: e.target.value })}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="concluido">Concluido</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setShowAddEvent(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddEvent}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Adicionando...' : 'Adicionar Evento'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Editar evento */}
          {editingEvent && (
            <div className="fixed inset-0 min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-200 to-indigo-300 font-sans flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">Editar Evento</h2>
                
                <div className="space-y-4">

                  <div>
                    <label className="block text-gray-700 mb-1">Título:</label>
                    <input
                      type="text"
                      value={editingEvent.nome || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, nome: e.target.value})} // o e.target.value é o valor das variaveis ja preenchidos
                      className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      placeholder="Título do evento"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Descrição:</label>
                    <textarea
                      value={editingEvent.descricao || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, descricao: e.target.value})}
                      className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      rows="3"
                      placeholder="Descrição do evento"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Local:</label>
                    <input
                      type="text"
                      value={editingEvent.local || ''}
                      onChange={(e) => setEditingEvent({...editingEvent, local: e.target.value})}
                      className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      placeholder="Local do evento"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Data:</label>
                      <input
                        type="date"
                        value={formatDateForInput(editingEvent.data) || ''}
                        onChange={(e) => setEditingEvent({...editingEvent, data: e.target.value})}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Hora:</label>
                      <input
                        type="time"
                        value={editingEvent.hora || ''}
                        onChange={(e) => setEditingEvent({...editingEvent, hora: e.target.value})}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Vagas Totais:</label>
                      <input
                        type="number"
                        value={editingEvent.vagas_totais || ''}
                        onChange={(e) => setEditingEvent({...editingEvent, vagas_totais: parseInt(e.target.value) || 0})}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Status:</label>
                      <select
                        value={editingEvent.statu_s || ''}
                        onChange={(e) => setEditingEvent({...editingEvent, statu_s: e.target.value})}
                        className="w-full p-2 border rounded text-gray-900 placeholder:text-gray-700"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="concluido">Concluido</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando eventos...</p>
            </div>
          ) : (
            // Lista de eventos
            <div className="flex flex-wrap gap-8 justify-center">
              {eventos.length > 0 ? (
                eventos.map((evento) => (
                  <div key={evento.id} className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col">
                    <div className="flex-grow">
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
                    
                    {/* Botões de editar e eliminar evento */}
                    <div className="border-t mt-4 pt-4 flex justify-end gap-3">
                      <button 
                        onClick={() => setEditingEvent(evento)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                        disabled={isLoading}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(evento.documentId)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                        disabled={isLoading}
                      >
                        Deletar
                      </button>
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
    </main>
  );
}