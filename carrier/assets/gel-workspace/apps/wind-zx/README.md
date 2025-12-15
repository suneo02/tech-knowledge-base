# Wind-ZX Project

This project has been migrated from static HTML/CSS/JS to a webpack-based build system.

## Project Structure

```
wind-zx/
├── dist/               # Build output directory
├── src/                # Source files
│   ├── css/            # CSS files
│   ├── images/         # Image files
│   ├── js/             # JavaScript/TypeScript files
│   │   ├── components/ # JS components
│   │   │   └── about/  # About page components
│   │   ├── config/     # Configuration files
│   │   ├── types/      # TypeScript type definitions
│   │   └── utils/      # Utility functions
│   └── templates/      # HTML templates
├── resource/           # Legacy resource files (for reference)
├── .babelrc            # Babel configuration
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── webpack.common.js   # Common webpack configuration
├── webpack.dev.js      # Development webpack configuration
├── webpack.prod.js     # Production webpack configuration
└── proxy.js            # API proxy server
```

## Development

To start the development server:

```bash
npm start
```

This will start webpack-dev-server with hot module replacement and proxy configuration.

## Production Build

To build for production:

```bash
npm run build
```

This will create optimized assets in the `dist` directory.

## Proxy Server

If you need to run the standalone proxy server:

```bash
npm run proxy
```

This will start the Express proxy server that handles API requests.

## Features

- Automatic CSS and JS bundling
- Image optimization
- Hash-based cache busting for assets
- Development server with hot reload
- API proxy for development
- Production optimization (minification, code splitting)
- Component-based architecture for about pages
- Dependencies managed with pnpm
- JS-based components for better modularity
- TypeScript support for type safety
- Special resource files handling (PDF, DOCX, etc.)

## Dependency Management

The project uses pnpm to manage dependencies:

- jQuery: Installed via pnpm
  - Imported in JS files with `import 'jquery'`
  - Bundled with webpack for better control and reliability

This approach provides several benefits:
1. Centralized dependency management with pnpm
2. Consistent versioning across the application
3. Better offline development experience
4. Improved build reliability and control

## Component Architecture

The project uses a component-based architecture for better modularity:

### JS Components

- Components are defined as JavaScript functions that return HTML strings
- Located in `src/js/components/` directory
- Each component is a separate module that exports a default function
- Components are imported and used in the application through the component loader

### Component Loader

The component loader (`src/js/componentLoader.js`) provides two main functions:

- `loadComponent(componentName, container)`: Loads a component into a specified container
- `getComponentContent(componentName)`: Returns the HTML content of a component

### Usage Example

```javascript
// Import the component loader
import { loadComponent } from './componentLoader';

// Load the contact component into the .contact-content container
loadComponent('about/contact', '.contact-content');
```

## TypeScript Support

The project includes TypeScript support for better type safety and developer experience:

### TypeScript Configuration

- TypeScript configuration is defined in `tsconfig.json`
- Supports both `.ts` and `.tsx` file extensions
- Includes type definitions for jQuery via `@types/jquery`

### TypeScript Features

- Type definitions in `src/js/types/` directory
- Utility functions with proper type annotations in `src/js/utils/`
- Webpack configured to process TypeScript files

### Usage Example

```typescript
// Import types
import { Article } from './types';
import { formatDate } from './utils';

// Use with type safety
const article: Article = {
  id: 1,
  title: 'Example Article',
  content: 'This is an example article',
  date: formatDate(new Date()),
  source: 'Wind ZX'
};
```

## Special Resource Files

The project supports handling special resource files like PDF, DOCX, XLSX, etc.:

### Configuration

Special resource files are configured in `webpack.common.js` with the following rule:

```javascript
{
  test: /\.(pdf|docx|xlsx|pptx|doc|xls|ppt)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'documents/[name][ext]',
  },
}
```

### Features

- Automatically copies resource files to the `dist/documents/` directory
- Preserves original filenames
- Allows importing resource files directly in JavaScript/TypeScript files
- Generates correct relative paths for use in the application

### Usage Example

```javascript
// Import document files
import applyFormDoc from '../resource/static/Objection-Application-form-legal-entity.docx';
import reportDemo from '../resource/static/report-demo-11.pdf';

// Use the imported paths
const downloadLink = document.createElement('a');
downloadLink.href = applyFormDoc;
downloadLink.textContent = '下载申请表';
downloadLink.setAttribute('download', 'Objection-Application-form-legal-entity.docx');
```