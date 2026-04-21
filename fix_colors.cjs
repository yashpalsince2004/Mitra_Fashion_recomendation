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
        let originalContent = content;
        
        // Use text-muted for white with opacity (text-white/40 etc)
        content = content.replace(/text-white\/\d{1,2}/g, 'text-muted');
        
        // Use text-main for solid white text
        content = content.replace(/text-white(?![\w\-\/])/g, 'text-main');
        
        // Convert white borders with opacity to ghost-border
        content = content.replace(/border-white\/\d{1,2}/g, 'ghost-border');
        
        // Convert white backgrounds with opacity to glass-drawer or glass depending on context, or just empty if not needed
        // Since we are in light theme, white/10 or white/5 might actually mix with the light bg differently.
        // Let's replace bg-white/XX with bg-black/5 to maintain contrast if they meant dark overlays? 
        // Wait, glassmorphism on light theme usually uses glass or ghost-border.
        content = content.replace(/bg-white\/\d{1,3}/g, 'bg-surface-low border ghost-border');
        
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content);
          console.log("Updated: " + filePath);
        }
    }
});
console.log("Color script executed successfully.");
