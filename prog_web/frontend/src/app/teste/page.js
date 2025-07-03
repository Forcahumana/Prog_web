export default async function Home() {
  const res = await fetch('http://localhost:1337/api/eventos', { cache: 'no-store' });
  const data = await res.json();
  console.log(data);

  return (
    <div>
      <h1>Eventos</h1>
      <ul>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </ul>
    </div>
  );
}
