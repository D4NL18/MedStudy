const fs = require('fs');
const path = require('path');

function processComponent(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Function to extract blocks safely considering nested brackets if any
  // But regex for `template: \`...\`` is usually safe if there are no backticks inside
  const templateRegex = /template\s*:\s*`([\s\S]*?)`(?=\s*,|\s*\n\s*\})/;
  const templateMatch = code.match(templateRegex);
  
  if (templateMatch) {
    const templateContent = templateMatch[1];
    const htmlPath = filePath.replace('.ts', '.html');
    fs.writeFileSync(htmlPath, templateContent.trim() + '\n', 'utf8');
    
    const fileName = path.basename(htmlPath);
    code = code.replace(templateRegex, `templateUrl: './${fileName}'`);
    changed = true;
  } else {
    // Single quotes fallback
    const templateRegexSq = /template\s*:\s*'([\s\S]*?)'(?=\s*,|\s*\n\s*\})/;
    const templateMatchSq = code.match(templateRegexSq);
    if (templateMatchSq) {
      const templateContent = templateMatchSq[1];
      const htmlPath = filePath.replace('.ts', '.html');
      fs.writeFileSync(htmlPath, templateContent.trim() + '\n', 'utf8');
      
      const fileName = path.basename(htmlPath);
      code = code.replace(templateRegexSq, `templateUrl: './${fileName}'`);
      changed = true;
    }
  }

  // Styles
  const stylesRegex = /styles\s*:\s*\[\s*`([\s\S]*?)`\s*\](?=\s*,|\s*\n\s*\})/;
  const stylesMatch = code.match(stylesRegex);
  if (stylesMatch) {
    const stylesContent = stylesMatch[1];
    const scssPath = filePath.replace('.ts', '.scss');
    fs.writeFileSync(scssPath, stylesContent.trim() + '\n', 'utf8');
    
    const fileName = path.basename(scssPath);
    code = code.replace(stylesRegex, `styleUrls: ['./${fileName}']`);
    changed = true;
  } else {
    const stylesRegexSq = /styles\s*:\s*\[\s*'([\s\S]*?)'\s*\](?=\s*,|\s*\n\s*\})/;
    const stylesMatchSq = code.match(stylesRegexSq);
    if (stylesMatchSq) {
      const stylesContent = stylesMatchSq[1];
      const scssPath = filePath.replace('.ts', '.scss');
      fs.writeFileSync(scssPath, stylesContent.trim() + '\n', 'utf8');
      
      const fileName = path.basename(scssPath);
      code = code.replace(stylesRegexSq, `styleUrls: ['./${fileName}']`);
      changed = true;
    }
  }

  // Fix multiple styleUrls arrays if multiple styles were inline (uncommon but possible)
  // Our regex assumes single string in array.

  if (changed) {
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Refactored: ${filePath.replace(path.join(__dirname, 'src', 'app'), '')}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.component.ts') || fullPath.endsWith('.ts')) {
      if (!fullPath.endsWith('.spec.ts')) {
        processComponent(fullPath);
      }
    }
  }
}

walk(path.join(__dirname, 'src', 'app'));
console.log('Wave 1 completed.');
