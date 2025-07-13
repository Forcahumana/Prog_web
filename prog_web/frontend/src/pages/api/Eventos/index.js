// endpoint para listar e criar eventos

export default async function handler(req, res) {
  const jwt = req.headers.authorization?.split(' ')[1];
  
  if (!jwt) return res.status(401).json({ error: 'Não autorizado' });

  const url = `http://localhost:1337/api/eventos`;
  
  try {
    if (req.method === 'GET') {
      const strapiRes = await fetch(url, {
        headers: { 'Authorization': `Bearer ${jwt}` }
      });
      const data = await strapiRes.json();
      res.status(200).json(data);
    }
    else if (req.method === 'POST') {
      const strapiRes = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(req.body)
      });
      const data = await strapiRes.json();
      res.status(200).json(data);
    }
    else {
      res.status(405).end();
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
}