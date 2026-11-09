const { clean, getQuery, searchDeezer, searchLyricsOvh } = require('./_lib');

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
  const query = clean(params.q || params.query);

  if (!query) {
    res.status(400).json({ error: 'Missing query' });
    return;
  }

  try {
    let songs;

    try {
      songs = await searchDeezer(query);
    } catch (error) {
      songs = await searchLyricsOvh(query);
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ songs });
  } catch (error) {
    res.status(502).json({ error: 'Unable to search for songs' });
  }
};
