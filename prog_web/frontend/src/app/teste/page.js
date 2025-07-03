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
            <strong>Status:</strong> {evento.statu_s}
          </li>
        ))}
      </ul>
    </div>
  );
}
