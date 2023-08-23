const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url || [];
    const results = [];

    const fetchData = async url => {
        try {
            const response = await axios.get(url, { timeout: 500 });
            if (response.status === 200) {
                const data = response.data.numbers || [];
                results.push(...data);
            }
        } catch (error) {
            console.error(`Error fetching data from ${url}: ${error.message}`);
        }
    };

    await Promise.all(urls.map(fetchData));

    const uniqueNumbers = Array.from(new Set(results)).sort((a, b) => a - b);

    res.json({ numbers: uniqueNumbers });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
