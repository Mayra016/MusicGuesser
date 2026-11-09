const { clean, getQuery } = require('./_lib');

const YOUTUBE_API = 'https://www.googleapis.com/youtube/v3/search';

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

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'YouTube API key is not configured' });
    return;
  }

  try {
    const url = `${YOUTUBE_API}?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      res.status(502).json({ error: 'Unable to search for a video' });
      return;
    }

    const data = await response.json();
    const videoId =
      data && data.items && data.items[0] && data.items[0].id
        ? data.items[0].id.videoId
        : null;

    if (!videoId) {
      res.status(404).json({ error: 'No video found' });
      return;
    }

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    res.status(200).json({ videoId });
  } catch (error) {
    res.status(502).json({ error: 'Unable to search for a video' });
  }
};
