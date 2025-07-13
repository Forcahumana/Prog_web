// Intermedio entre o strapi e o next.js

export default async function handler(req, res) {
  // Só aceita pedidos do tipo POST
  if (req.method !== 'POST') {
    // Erro 405
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Busca os dados do formulário
  const { identifier, password } = req.body;

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

  try {
    // Reencaminha o pedido de login para o endpoint de autenticação do strapi
    const strapiRes = await fetch(`${strapiUrl}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    // Resposta do Strapi para JSON
    const data = await strapiRes.json();

    // Se o Strapi der erro (por exemplo, credenciais inválidas), reencaminha o erro
    if (!strapiRes.ok) {
      return res.status(strapiRes.status).json({ error: data.error?.message || 'Invalid credentials' });
    }

    // Se o login for bem-sucedido, devolve a resposta do Strapi (incluindo o JWT)
    res.status(200).json(data);

  } catch (error) {
    // Se ocorrer algum erro inesperado, devolve erro 500 (Erro Interno do Servidor)
    res.status(500).json({ error: 'An error occurred during login.' });
  }
}