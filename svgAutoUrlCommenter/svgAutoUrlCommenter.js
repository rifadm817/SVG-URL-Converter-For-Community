const fs = require('fs');
const path = require('path');

// Determine the root directory of your project (assuming this script is in the project root)
const svgDirectory = path.join(__dirname, '..', '..', 'SVG URL Converter', 'SVG URL Converter', 'svgs');
const baseUrl = 'https://svgtourl.nw.r.appspot.com';

console.log('SVG Directory:', svgDirectory);

// Function to append URL comment to SVG files
const appendUrlCommentToSvg = (filePath, placeholders) => {
    const relativePath = path.relative(svgDirectory, filePath);
    const urlPath = relativePath.split(path.sep).join('/');
    const url = `${baseUrl}/svg/${urlPath}`;

    let queryParams = '';
    if (placeholders.length > 0) {
        queryParams = '?' + placeholders.map(p => `${p}={value}`).join('&');
    }

    const comment = `<!-- URL: ${url}${queryParams} -->\n`;

    console.log('Appending URL comment to:', filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`, err);
            return;
        }

        if (!data.startsWith(comment)) {
            const newData = comment + data;
            fs.writeFile(filePath, newData, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file: ${filePath}`, err);
                } else {
                    console.log(`Updated file: ${filePath}`);
                }
            });
        } else {
            console.log('Comment already present in:', filePath);
        }
    });
};

// Function to process each SVG file
const processSvgFile = (filePath) => {
    console.log('Processing file:', filePath);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`, err);
            return;
        }

        const regex = /{{(.*?)}}/g;
        let match;
        let placeholders = [];

        while ((match = regex.exec(data)) !== null) {
            placeholders.push(match[1]);
        }

        appendUrlCommentToSvg(filePath, placeholders);
    });
};

// Function to recursively read directories and process SVG files
const readDirectory = (directoryPath) => {
    fs.readdir(directoryPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Error reading directory', directoryPath, err);
            return;
        }

        entries.forEach(entry => {
            const fullPath = path.join(directoryPath, entry.name);
            if (entry.isDirectory()) {
                readDirectory(fullPath);
            } else if (path.extname(entry.name) === '.svg') {
                processSvgFile(fullPath);
            } else {
                console.log('Skipping non-SVG file:', fullPath);
            }
        });
    });
};

// Start processing
readDirectory(svgDirectory);
