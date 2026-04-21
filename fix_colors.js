const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // text-white/XX -> text-muted
        content = content.replace(/text-white\/\d{1,2}/g, 'text-muted');
        
        // text-white -> text-main
        content = content.replace(/text-white(?![\w\-\/])/g, 'text-main');
        
        // border-white/XX -> border-black/10 (to stand out on light bg)
        content = content.replace(/border-white\/\d{1,2}/g, 'border-black/5');
        
        // bg-white/XX -> bg-black/5
        content = content.replace(/bg-white\/\d{1,2}/g, 'bg-black/5');
        
        fs.writeFileSync(filePath, content);
    }
});
console.log("Colors fixed!");
