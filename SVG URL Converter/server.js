const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/svg/*', (req, res) => {
    let svgRelativePath = req.params[0];

    if (svgRelativePath.endsWith('.svg')) {
        svgRelativePath = svgRelativePath.slice(0, -4);
    }

    const svgPath = path.join(__dirname, 'svgs', svgRelativePath + '.svg');

    console.log(`Requested SVG: ${svgRelativePath}`);
    console.log(`Attempting to read SVG file from: ${svgPath}`);

    fs.readFile(svgPath, 'utf8', (err, svgData) => {
        if (err) {
            console.error('Error reading SVG file:', err);
            return res.status(404).send('SVG file not found');
        }

        let modifiedSvg = Object.entries(req.query).reduce((data, [key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            return data.replace(regex, value);
        }, svgData);

        // Send SVG directly
        res.set('Cache-Control', 'private, max-age=10000000');
        res.type('image/svg+xml');
        res.send(modifiedSvg);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
