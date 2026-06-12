const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');

// Map of filename patterns to their TSDoc descriptions
const fileDescriptions = {
  '.component.ts': (name) => `/**\n * Angular component for the ${name} feature.\n * @description Handles the presentation logic and user interactions for the ${name} view.\n */`,
  '.service.ts': (name) => `/**\n * Angular service responsible for ${name}-related HTTP communication and business logic.\n * @description Provides methods to interact with the backend API for ${name} operations.\n */`,
  '.guard.ts': (name) => `/**\n * Route guard for ${name}.\n * @description Determines whether navigation to a route should be allowed.\n */`,
  '.interceptor.ts': (name) => `/**\n * HTTP interceptor for ${name}.\n * @description Intercepts outgoing HTTP requests and/or incoming responses to apply cross-cutting concerns.\n */`,
  '.resolver.ts': (name) => `/**\n * Route resolver for ${name}.\n * @description Pre-fetches data before the target route is activated.\n */`,
  '.directive.ts': (name) => `/**\n * Angular directive for ${name}.\n * @description Applies custom behavior or transformation to a host element.\n */`,
  '.pipe.ts': (name) => `/**\n * Angular pipe for ${name}.\n * @description Transforms displayed values in templates.\n */`,
  '.actions.ts': (name) => `/**\n * NgRx actions for the ${name} feature slice.\n * @description Defines the action creators used to dispatch state changes for ${name}.\n */`,
  '.reducer.ts': (name) => `/**\n * NgRx reducer for the ${name} feature slice.\n * @description Handles state transitions in response to dispatched ${name} actions.\n */`,
  '.effects.ts': (name) => `/**\n * NgRx effects for the ${name} feature slice.\n * @description Handles side effects such as HTTP calls in response to ${name} actions.\n */`,
  '.selectors.ts': (name) => `/**\n * NgRx selectors for the ${name} feature slice.\n * @description Provides memoized queries to extract ${name} state from the store.\n */`,
  '.fixture.ts': (name) => `/**\n * Test fixture data for ${name}.\n * @description Provides reusable mock objects for use in unit and integration tests.\n */`,
  '.model.ts': (name) => `/**\n * TypeScript model/interface for ${name}.\n * @description Defines the data shape used by the application for ${name} entities.\n */`,
};

function getDocComment(filename) {
  const base = path.basename(filename, '.ts');
  // Remove pattern suffix to get feature name
  let name = base
    .replace(/\.(component|service|guard|interceptor|resolver|directive|pipe|actions|reducer|effects|selectors|fixture|model)$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  
  for (const [pattern, docFn] of Object.entries(fileDescriptions)) {
    if (filename.endsWith(pattern)) {
      return docFn(name);
    }
  }
  // Default
  return `/**\n * ${name}.\n * @description Provides ${name.toLowerCase()} functionality.\n */`;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has TSDoc
  if (content.includes('/**')) return false;
  
  // Skip empty files or files with no declarations
  if (!content.match(/^(export\s+)?(class|interface|enum|function|const|abstract)\s/m) &&
      !content.match(/^@Component/m) && !content.match(/^@Injectable/m) &&
      !content.match(/^@NgModule/m) && !content.match(/^@Directive/m) &&
      !content.match(/^@Pipe/m)) {
    return false;
  }

  const doc = getDocComment(path.basename(filePath));
  
  // Insert after the last import statement
  const lastImportMatch = [...content.matchAll(/^import\s.+?;[\r\n]*/gm)];
  if (lastImportMatch.length > 0) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    const insertAt = lastImport.index + lastImport[0].length;
    content = content.slice(0, insertAt) + '\n' + doc + '\n' + content.slice(insertAt);
  } else {
    content = doc + '\n' + content;
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += walkDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
      try {
        if (processFile(fullPath)) {
          console.log('Documented:', fullPath.replace(appDir, ''));
          count++;
        }
      } catch (e) {
        console.error('Error processing:', fullPath, e.message);
      }
    }
  }
  return count;
}

const total = walkDir(appDir);
console.log(`\nTotal files documented: ${total}`);
