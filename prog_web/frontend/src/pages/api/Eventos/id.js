export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.query;

  if (!token) return res.status(401).json({ error: 'Não autorizado' });

  try {
    if (req.method === 'PUT') {
      const strapiRes = await fetch(`http://localhost:1337/api/eventos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(req.body)
      });
      
      if (!strapiRes.ok) {
        const errorData = await strapiRes.json();
        throw new Error(errorData.error?.message || 'Falha ao atualizar evento');
      }
      
      const data = await strapiRes.json();
      return res.status(200).json(data);
    }
    else if (req.method === 'DELETE') {
      const strapiRes = await fetch(`http://localhost:1337/api/eventos/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      
      if (strapiRes.ok) {
        return res.status(200).json({ success: true });
      } else {
        const errorData = await strapiRes.json();
        throw new Error(errorData.error?.message || 'Falha ao eliminar evento');
      }
    }
    else {
      return res.status(405).end();
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}