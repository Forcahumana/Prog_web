'use client';
import { useState } from 'react';

export default function EventManager({ events, onUpdate }) {
  const [newEvent, setNewEvent] = useState({
    nome: '',
    descricao: '',
    data: '',
    hora: '',
    local: '',
    vagas_totais: 10,
    statu_s: 'ativo'
  });

  const handleUpdate = async (id, updates) => {
    await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({ data: updates })
    });
    onUpdate();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
    });
    onUpdate();
  };

  const handleCreate = async () => {
    await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({ data: newEvent })
    });
    setNewEvent({
      nome: '',
      descricao: '',
      data: '',
      hora: '',
      local: '',
      vagas_totais: 10,
      statu_s: 'ativo'
    });
    onUpdate();
  };

  return (
    <div className="event-manager">
      {/* Seu código de gerenciamento de eventos aqui */}
    </div>
  );
}