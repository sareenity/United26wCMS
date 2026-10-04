export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-CMS-Token'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = 'https://qttuvwyggpgqhfydbxvg.supabase.co';
  const targetUrl = `${supabaseUrl}/functions/v1/cms-api`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization || '',
    };

    const token = req.headers['x-cms-token'];
    if (token) {
      headers['X-CMS-Token'] = token;
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
