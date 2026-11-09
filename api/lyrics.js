const { clean, getLyrics, getQuery } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const params = getQuery(req);
  const title = clean(params.title);
  const artist = clean(params.artist);
  const query = clean(params.q || params.query);

  if (!title && !query) {
    res.status(400).json({ error: 'Missing title or query' });
    return;
  }

  try {
    const result = await getLyrics({ title, artist, query });
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json(result);
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({ error: 'No lyrics found' });
      return;
    }

    res.status(502).json({ error: 'Unable to fetch lyrics' });
  }
};
