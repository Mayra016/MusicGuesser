const DEEZER_API = 'https://api.deezer.com';
const LRCLIB_API = 'https://lrclib.net/api';
const LYRICS_OVH_API = 'https://api.lyrics.ovh';

function clean(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function getQuery(req) {
  const url = new URL(req.url || '/', 'http://localhost');
  return Object.fromEntries(url.searchParams.entries());
}

function parseTrackQuery(query) {
  const text = clean(query);
  const index = text.toLowerCase().lastIndexOf(' by ');

  if (index >= 0) {
    return {
      title: text.slice(0, index).trim(),
      artist: text.slice(index + 4).trim()
    };
  }

  return { title: text, artist: '' };
}

async function fetchJson(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'MusicGuesser/1.0'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const error = new Error(`Request failed with status ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function normalize(value) {
  return clean(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function pickBest(candidates, title, artist) {
  const usable = candidates.filter(
    (candidate) => candidate && candidate.plainLyrics && !candidate.instrumental
  );

  if (!usable.length) {
    return null;
  }

  const targetTitle = normalize(title);
  const targetArtist = normalize(artist);
  let best = null;
  let bestScore = Infinity;

  for (const candidate of usable) {
    const candidateTitle = normalize(candidate.trackName || candidate.name);
    const candidateArtist = normalize(candidate.artistName);
    let score = 0;

    if (targetTitle && candidateTitle === targetTitle) {
      score -= 4;
    } else if (
      targetTitle &&
      (candidateTitle.includes(targetTitle) || targetTitle.includes(candidateTitle))
    ) {
      score -= 2;
    }

    if (targetArtist && candidateArtist === targetArtist) {
      score -= 4;
    } else if (
      targetArtist &&
      (candidateArtist.includes(targetArtist) || targetArtist.includes(candidateArtist))
    ) {
      score -= 2;
    }

    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

async function searchDeezer(query) {
  const url = `${DEEZER_API}/search?limit=15&q=${encodeURIComponent(query)}`;
  const data = await fetchJson(url);

  if (data && data.error) {
    throw new Error(data.error.message || 'Deezer request failed');
  }

  return (data && data.data ? data.data : [])
    .filter((item) => item && item.title && item.artist && item.artist.name)
    .map((item) => ({
      id: item.id,
      title: item.title,
      artist: item.artist.name,
      album: item.album ? item.album.title : ''
    }));
}

async function searchLyricsOvh(query) {
  const url = `${LYRICS_OVH_API}/suggest/${encodeURIComponent(query)}`;
  const data = await fetchJson(url);

  return (data && data.data ? data.data : [])
    .filter((item) => item && item.title && item.artist && item.artist.name)
    .map((item) => ({
      id: item.id,
      title: item.title,
      artist: item.artist.name,
      album: item.album ? item.album.title : ''
    }));
}

async function lyricsFromLrclib(title, artist, query) {
  if (title && artist) {
    try {
      const data = await fetchJson(
        `${LRCLIB_API}/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`
      );

      if (data && data.plainLyrics) {
        return {
          lyrics: data.plainLyrics,
          title: data.trackName || title,
          artist: data.artistName || artist,
          source: 'lrclib'
        };
      }
    } catch (error) {
      if (error.status !== 404) {
        // Fall through to the search endpoint.
      }
    }
  }

  const params = new URLSearchParams();

  if (title && artist) {
    params.set('track_name', title);
    params.set('artist_name', artist);
  } else if (query || title) {
    params.set('q', query || title);
  }

  if (![...params].length) {
    return null;
  }

  try {
    const data = await fetchJson(`${LRCLIB_API}/search?${params.toString()}`);
    const candidates = Array.isArray(data) ? data : [];
    const best = pickBest(candidates, title || query, artist);

    if (best) {
      return {
        lyrics: best.plainLyrics,
        title: best.trackName || title,
        artist: best.artistName || artist,
        source: 'lrclib'
      };
    }
  } catch (error) {
    // Fall through to lyrics.ovh.
  }

  return null;
}

async function lyricsFromOvh(title, artist, query) {
  let resolvedTitle = title;
  let resolvedArtist = artist;

  if (!resolvedArtist && (query || title)) {
    try {
      const suggestions = await searchLyricsOvh(query || title);

      if (suggestions.length) {
        resolvedTitle = resolvedTitle || suggestions[0].title;
        resolvedArtist = suggestions[0].artist;
      }
    } catch (error) {
      // Keep the original values and let the direct lookup try.
    }
  }

  if (!resolvedTitle || !resolvedArtist) {
    return null;
  }

  try {
    const data = await fetchJson(
      `${LYRICS_OVH_API}/v1/${encodeURIComponent(resolvedArtist)}/${encodeURIComponent(resolvedTitle)}`
    );

    if (data && data.lyrics) {
      return {
        lyrics: data.lyrics,
        title: resolvedTitle,
        artist: resolvedArtist,
        source: 'lyrics.ovh'
      };
    }
  } catch (error) {
    // Fall through and report a not-found error.
  }

  return null;
}

async function getLyrics({ title, artist, query }) {
  const parsed = parseTrackQuery(query || '');
  let songTitle = clean(title) || parsed.title;
  let artistName = clean(artist) || parsed.artist;

  if (!artistName && (query || songTitle)) {
    try {
      const suggestions = await searchDeezer(query || songTitle);

      if (suggestions.length) {
        songTitle = songTitle || suggestions[0].title;
        artistName = suggestions[0].artist;
      }
    } catch (error) {
      // Continue without a resolved artist.
    }
  }

  const lrclibResult = await lyricsFromLrclib(songTitle, artistName, query || songTitle);

  if (lrclibResult) {
    return lrclibResult;
  }

  const ovhResult = await lyricsFromOvh(songTitle, artistName, query || songTitle);

  if (ovhResult) {
    return ovhResult;
  }

  const error = new Error('No lyrics found');
  error.status = 404;
  throw error;
}

module.exports = {
  clean,
  getQuery,
  getLyrics,
  searchDeezer,
  searchLyricsOvh
};
