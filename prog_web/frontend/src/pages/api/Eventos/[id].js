export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Ensure this points to your Strapi URL, with no extra slashes at the end
  const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/eventos/${id}`;

  // This handler only works for PUT and DELETE
  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const strapiRes = await fetch(strapiUrl, {
      method: req.method, // Pass the original method (PUT or DELETE)
      headers: {
        'Authorization': `Bearer ${token}`,
        // Only add Content-Type for PUT requests
        ...(req.method === 'PUT' && { 'Content-Type': 'application/json' }),
      },
      // Only add the body for PUT requests
      ...(req.method === 'PUT' && { body: JSON.stringify(req.body) }),
    });

    // Handle empty responses (like a 204 No Content) gracefully
    const responseText = await strapiRes.text();
    const data = responseText ? JSON.parse(responseText) : null;

    // Forward Strapi's exact status code and data back to your website
    return res.status(strapiRes.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor proxy', details: error.message });
  }
}