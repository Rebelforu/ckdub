const fs = require('fs');
const glob = require('glob'); // Note: we'll just write a quick recurse function instead
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = {
  'Ã¢â‚¬â€ ': '—',
  'â• â• â• ': '===',
  'Â·': '•',
  'â€¦': '...',
  'âœ•': '✕',
  'â† ': '←',
  'â†’': '→',
  'â€¢': '•',
  'â€”': '—',
  'Â': '' // Clean up any trailing Â
};

walk('src', function(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', filePath);
  }
});
