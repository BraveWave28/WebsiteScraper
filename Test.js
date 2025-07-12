import express from 'express';
import https from 'https';

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
    const regex = /<a[^>]*href="([^"]+)">\s*<span>(.*?)<\/span>\s*<\/a>/gi;

    let match;

    while ((match = regex.exec(html)) !== null && stories.length < 6) {
        const link = match[1].startsWith('http') ? match[1] : 'https://time.com' + match[1];
        const title = match[2].trim();

        if (!stories.some(story => story.link === link)) {
            stories.push({ title, link });
        }
    }

    return stories;
}

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}/getTimeStories`);
});
