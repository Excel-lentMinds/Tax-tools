const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Find the first </html> line
let cutoffLine = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '</html>') {
        cutoffLine = i;
        break;
    }
}

if (cutoffLine > 0) {
    const cleanLines = lines.slice(0, cutoffLine + 1);
    fs.writeFileSync(filePath, cleanLines.join('\r\n'), 'utf8');
    console.log('Successfully truncated index.html at line', cutoffLine + 1);
    console.log('Removed', lines.length - cutoffLine - 1, 'orphaned lines');
} else {
    console.log('Could not find </html> tag');
}
