const fs = require('fs');
const path = require('path');
const os = require('os');

const rootDir = path.join(__dirname, '..');
const configPath = path.join(rootDir, '.github/quartz/quartz.config.ts');
const themePath = path.join(rootDir, '.obsidian/themes/Cascade-Quartz/theme.css');

// ANSI sequence for yellow warning
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log('Validating Obsidian Vault Integrity...\n');

// 1. Check Theme Synchronization
let isThemeSynced = true;
try {
    const themeContent = fs.readFileSync(themePath, 'utf8');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Quick sampling. Check if lightMode dark matches h1-color in theme-light
    const lightBlockMatch = themeContent.match(/\.theme-light\s*{([^}]+)}/m);
    if (lightBlockMatch) {
        const h1Match = lightBlockMatch[1].match(/--h1-color:\s*([^;!]+)/);
        const h1ThemeColor = h1Match ? h1Match[1].trim().replace(/^['"]|['"]$/g, '') : null;
        
        // Extract lightMode dark from quartz.config.ts
        const configLightModeMatch = configContent.match(/lightMode:\s*{([^}]+)}/m);
        if (configLightModeMatch && h1ThemeColor) {
            const configDarkMatch = configLightModeMatch[1].match(/dark:\s*['"]([^'"]+)['"]/);
            const configDarkColor = configDarkMatch ? configDarkMatch[1].trim() : null;
            
            if (configDarkColor !== h1ThemeColor) {
                isThemeSynced = false;
                console.log(`${YELLOW}====================================================${RESET}`);
                console.log(`${YELLOW}WARNING: Obsidian Theme configuration is desynced!${RESET}`);
                console.log(`${YELLOW}Obsidian Header Color: ${h1ThemeColor}${RESET}`);
                console.log(`${YELLOW}Quartz Config Header Color: ${configDarkColor}${RESET}`);
                console.log(`${YELLOW}Please run 'node .github/quartz/push-theme.cjs' to sync.${RESET}`);
                console.log(`${YELLOW}====================================================\n${RESET}`);
            }
        }
    }
} catch (e) {
    console.log(`${YELLOW}Warning: Could not automatically verify theme files.${RESET}`);
}


// 2. Check Link Consistency
const getFiles = (dir, ext) => {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'internal' && file !== 'scripts' && file !== 'node_modules') {
                results = results.concat(getFiles(fullPath, ext));
            }
        } else {
            if (file.endsWith(ext)) {
                results.push(fullPath);
            }
        }
    }
    return results;
};

// Build an array of all available valid link targets (relative to rootDir)
const allFiles = getFiles(rootDir, '');
const validPaths = allFiles.map(f => path.relative(rootDir, f));

function isLinkValid(linkTarget) {
    const targetLower = linkTarget.toLowerCase();
    
    for (const f of validPaths) {
        const fLower = f.toLowerCase();
        
        // Exact full path match (with extension)
        if (fLower === targetLower) return true;
        
        // Exact full path match (without extension)
        const fNoExt = fLower.replace(/\.[^/.]+$/, "");
        if (fNoExt === targetLower) return true;
        
        // Shortest path match: f ends with /target
        if (fLower.endsWith('/' + targetLower)) return true;
        if (fNoExt.endsWith('/' + targetLower)) return true;
        
        // Pure basename match (without path)
        if (path.basename(fLower) === targetLower) return true;
        if (path.basename(fNoExt) === targetLower) return true;
    }
    return false;
}

const mdFiles = getFiles(rootDir, '.md');
let brokenLinks = [];

mdFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Obsidian wikilinks: [[Link Target]] or [[Link Target|Alias]] or [[Link Target#Heading]] or ![[Image.png]]
    const wikilinkRegex = /!?\[\[([^\]]+)\]\]/g;
    let match;
    
    while ((match = wikilinkRegex.exec(content)) !== null) {
        let linkTarget = match[1];
        
        // Strip alias
        if (linkTarget.includes('|')) {
            linkTarget = linkTarget.split('|')[0];
        }
        
        // Strip heading reference
        if (linkTarget.includes('#')) {
            linkTarget = linkTarget.split('#')[0];
        }
        
        // Headings within the same file e.g. [[#Heading]]
        if (!linkTarget || linkTarget.trim() === '') continue;

        if (!isLinkValid(linkTarget)) {
            const relPath = path.relative(rootDir, file);
            brokenLinks.push(`  - In '${relPath}' => Broken link: [[${match[1]}]]`);
        }
    }
});

if (brokenLinks.length > 0) {
    console.log(`${YELLOW}====================================================${RESET}`);
    console.log(`${YELLOW}WARNING: Found missing files / broken relative links!!${RESET}`);
    brokenLinks.forEach(link => console.log(`${YELLOW}${link}${RESET}`));
    console.log(`${YELLOW}====================================================\n${RESET}`);
}

console.log('Vault configuration check complete.');
process.exit(0);
