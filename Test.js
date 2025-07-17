import express from 'express';
import https from 'https';
import { load } from 'cheerio';

const app = express();
const PORT = 3000;

app.get('/getTimeStories', (req, res) => {
    const url = 'https://time.com';

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const stories = extractStories(data);
            res.json(stories);
        });

    }).on('error', (err) => {
        console.error('Error fetching Time.com:', err.message);
        res.status(500).send('Error fetching stories');
    });
});

function extractStories(html) {
    const stories = [];
    const $ = load(html);

    // Adjust the selector to match the structure of time.com
    // For example, let's assume stories are in <a> tags with a specific class
    $('a').each((i, elem) => {
        if (stories.length >= 6) return false; // break after 6 stories

        const title = $(elem).find('span').text().trim();
        const href = $(elem).attr('href');

        if (title && href) {
            const link = href.startsWith('http') ? href : 'https://time.com' + href;
            if (!stories.some(story => story.link === link)) {
                stories.push({ title, link });
            }
        }
    });

    return stories;
}

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}/getTimeStories`);
});
