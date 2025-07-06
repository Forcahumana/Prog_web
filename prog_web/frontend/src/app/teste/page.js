export default async function Home() {
  const res = await fetch('http://localhost:1337/api/eventos', { cache: 'no-store' });
  const json = await res.json();
  const eventos = json.data;

  return (
    <div>
      <h1>Eventos</h1>
      <ul>
        {eventos.map((evento) => (
          <li key={evento.id}>
            <strong>Nome:</strong> {evento.nome} <br />
            <strong>Descrição:</strong> {evento.descricao} <br />
            <strong>Data:</strong> {new Date(evento.data).toLocaleDateString()} <br />
            <strong>Hora:</strong> {evento.hora ? new Date(`1970-01-01T${evento.hora}`).toLocaleTimeString() : 'Não definido.'} <br />
            <strong>Local:</strong> {evento.local} <br />
            <strong>Vagas:</strong>{" "}
            {(evento.vagas_ocupadas ?? 0) >= (evento.vagas_totais ?? 0)
              ? "Cheio"
              : `${evento.vagas_ocupadas ?? 0} / ${evento.vagas_totais ?? 0}`
            } <br />
            <strong>Status:</strong> {evento.statu_s}
          </li>
        ))}
      </ul>
    </div>
  );
}
