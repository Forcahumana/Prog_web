// Recebe e valida dos dados de login do admin

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { identifier, password } = req.body;
  
  try {
    const strapiRes = await fetch(`${process.env.STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    const data = await strapiRes.json();

    if (data.jwt) {
      res.status(200).json({ jwt: data.jwt });
    } else {
      res.status(401).json({ error: data.message || 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}