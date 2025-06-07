import * as functions from 'firebase-functions';
import axios from 'axios';
export const geniusProxy = functions.https.onRequest(async (req, res) => {
    try {
        const query = req.query['q'];
        if (!query) {
            res.status(400).json({ error: 'Query parameter "q" is required' });
            return;
        }
        const response = await axios.get(`https://api.genius.com/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': 'Bearer -riMsB6htPjCj--rQmpY4EyFTwRViRwcOgmnaBhUfOENWwrZVbBGP5sFB1RH6xcE'
            }
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error calling Genius API:', error);
        res.status(500).json({ error: 'Error al contactar la API de Genius' });
    }
});
