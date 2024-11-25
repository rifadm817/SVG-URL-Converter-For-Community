const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const svgDirectory = '../../SVG URL Converter/SVG URL Converter/svgs';

console.log('Watching SVG Directory for changes:', svgDirectory);

fs.watch(svgDirectory, { recursive: true }, (eventType, filename) => {
    if (eventType === 'change' && path.extname(filename) === '.svg') {
        console.log(`Change detected in file: ${filename}`);
        
        // Run svgAutoUrlCommenter.js whenever a change occurs
        const svgAutoUrlCommenterProcess = spawn('node', ['svgAutoUrlCommenter.js', path.join(svgDirectory, filename)], {
            cwd: __dirname, // Set the current working directory to the location of this script
        });

        svgAutoUrlCommenterProcess.stdout.on('data', (data) => {
            console.log(`svgAutoUrlCommenter.js output: ${data}`);
        });

        svgAutoUrlCommenterProcess.stderr.on('data', (data) => {
            console.error(`svgAutoUrlCommenter.js error: ${data}`);
        });
    }
});
