// endpoint para poder editar ou eliminar eventos

export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
  const strapiUrl = `${apiUrl}/api/eventos/${id}`;

  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const strapiRes = await fetch(strapiUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...(req.method === 'PUT' && { 'Content-Type': 'application/json' }),
      },
      ...(req.method === 'PUT' && { body: JSON.stringify(req.body) }),
    });

    const responseText = await strapiRes.text();
    const data = responseText ? JSON.parse(responseText) : null;

    return res.status(strapiRes.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor proxy', details: error.message });
  }
}