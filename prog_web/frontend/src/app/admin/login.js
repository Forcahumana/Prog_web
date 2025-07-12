// src/pages/api/admin/login.js

export default async function handler(req, res) {
  // Ensure we're only accepting POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the credentials from the request body
  const { identifier, password } = req.body;

  // URL of your Strapi backend from environment variables
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    // Forward the login request to Strapi's auth endpoint
    const strapiRes = await fetch(`${strapiUrl}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await strapiRes.json();

    // If Strapi returns an error (e.g., invalid credentials), forward it
    if (!strapiRes.ok) {
      return res.status(strapiRes.status).json({ error: data.error?.message || 'Invalid credentials' });
    }

    // Forward the successful response (including the JWT) from Strapi
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login.' });
  }
}