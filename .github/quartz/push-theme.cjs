const fs = require('fs');
const path = require('path');
const os = require('os');

const configPath = path.join(__dirname, 'quartz.config.ts');
const themePath = path.join(__dirname, '../../.obsidian/themes/Cascade-Quartz/theme.css');

if (!fs.existsSync(themePath)) {
    console.error("Could not find theme.css. Are you sure the Obsidian theme exists?");
    process.exit(1);
}

const themeContent = fs.readFileSync(themePath, 'utf8');
const configContent = fs.readFileSync(configPath, 'utf8');


// Helper to extract a variable from a specific block
function getVar(blockName, varName) {
    const blockRegex = new RegExp(`\\.${blockName}\\s*{([^}]+)}`, 'm');
    const blockMatch = themeContent.match(blockRegex);
    if (!blockMatch) return null;
    
    const varRegex = new RegExp(`--${varName}:\\s*([^;!]+)`);
    const varMatch = blockMatch[1].match(varRegex);
    // Remove wrapping quotes if they accidentally get matched
    return varMatch ? varMatch[1].trim().replace(/^['"]|['"]$/g, '') : null;
}

// Map Obsidian vars back to Quartz
function buildModeString(cssBlock) {
    const light = getVar(cssBlock, 'background-primary') || '#faf8f8';
    const darkgray = getVar(cssBlock, 'text-normal') || '#4e4e4e';
    const gray = getVar(cssBlock, 'text-muted') || '#b8b8b8';
    const secondary = getVar(cssBlock, 'text-accent') || '#284b63';
    const tertiary = getVar(cssBlock, 'text-accent-hover') || '#d46329ff';
    const highlight = getVar(cssBlock, 'text-selection') || 'rgba(143, 159, 169, 0.15)';
    const textHighlight = getVar(cssBlock, 'text-highlight-bg') || '#fff23688';
    const dark = getVar(cssBlock, 'h1-color') || '#284b63';
    
    // lightgray in quartz is typically borders or light accents
    const lightgray = tertiary; // we map it back to tertiary to preserve existing schema

    return {
        light,
        lightgray,
        gray,
        darkgray,
        dark,
        secondary,
        tertiary,
        highlight,
        textHighlight
    };
}

const lightOpts = buildModeString('theme-light');
const darkOpts = buildModeString('theme-dark');

function formatOpts(opts) {
    return `{\n          ` + 
    `light: "${opts.light}",\n          ` +
    `lightgray: "${opts.lightgray}",\n          ` +
    `gray: "${opts.gray}",\n          ` +
    `darkgray: "${opts.darkgray}",\n          ` +
    `dark: "${opts.dark}",\n          ` +
    `secondary: "${opts.secondary}",\n          ` +
    `tertiary: "${opts.tertiary}",\n          ` +
    `highlight: "${opts.highlight}",\n          ` +
    `textHighlight: "${opts.textHighlight}",\n        ` +
    `}`;
}

// Replace in config file
let newConfigContent = configContent.replace(
    /lightMode:\s*{[^}]*}/,
    `lightMode: ${formatOpts(lightOpts)}`
);

newConfigContent = newConfigContent.replace(
    /darkMode:\s*{[^}]*}/,
    `darkMode: ${formatOpts(darkOpts)}`
);

fs.writeFileSync(configPath, newConfigContent);
console.log('Successfully pushed Obsidian theme colors back to .github/quartz/quartz.config.ts!');
