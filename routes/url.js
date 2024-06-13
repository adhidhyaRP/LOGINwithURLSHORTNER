import express from 'express';
import { nanoid } from 'nanoid';
import URL from '../models/url.js';

const router = express.Router();

router.post('/getshortURL', async (req, res) => {
    const { URL: longURL } = req.body;

    try {
        let urlObj = await URL.findOne({ URL: longURL });
        if (urlObj) return res.send(urlObj.shortURL);

        const shortcode = nanoid(7);
        const shortURL = `https://loginwithurlshortner-3.onrender.com//${shortcode}`;
        urlObj = new URL({ URL: longURL, shortURL, shortcode });
        await urlObj.save();
        res.send(shortURL);
    } catch (error) {
        console.log('Error creating short URL:', error);
        res.status(500).send({ status: false, message: 'Error creating short URL' });
    }
});

router.get('/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const urlObj = await URL.findOne({ shortcode: code });
        if (!urlObj) return res.status(404).send('URL not found');

        urlObj.clicks += 1;
        await urlObj.save();
        res.redirect(urlObj.URL);
    } catch (error) {
        console.log('Error redirecting:', error);
        res.status(500).send({ status: false, message: 'Error redirecting' });
    }
});

export default router;
