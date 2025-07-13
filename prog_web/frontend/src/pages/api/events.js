// endpoint para listar eventos

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    const strapiRes = await fetch(`http://localhost:1337/api/eventos`, {
      headers: {
        'Authorization': authorization,
      },
    });

    if (!strapiRes.ok) {
      const errorData = await strapiRes.json();
      return res.status(strapiRes.status).json({ error: errorData.error?.message || 'Failed to fetch events from Strapi' });
    }

    const data = await strapiRes.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: 'An internal server error occurred' });
  }
}