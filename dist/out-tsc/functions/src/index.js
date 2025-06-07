import * as functions from 'firebase-functions';
import axios from 'axios';
export const geniusProxy = functions.https.onRequest(async (req, res) => {
    try {
        const query = req.query['q'];
        const response = await axios.get(`https://api.genius.com/search?q=${query}`, {
            headers: { "Authorization": "Bearer -riMsB6htPjCj--rQmpY4EyFTwRViRwcOgmnaBhUfOENWwrZVbBGP5sFB1RH6xcE"
            }
        });
        res.json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: 'Error contacting Genius API' });
    }
});
