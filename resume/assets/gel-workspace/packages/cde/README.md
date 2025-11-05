# gel-ui

A React component library built with TypeScript and Vite.

## Installation

```bash
pnpm add gel-ui
```

## Usage

```tsx
import { Button } from 'gel-ui';

function App() {
  return (
    <Button variant="primary" size="medium" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  );
}
```

## Available Components

### Button
A customizable button component with different variants and sizes.

Props:
- `variant`: 'primary' | 'secondary' | 'text' (default: 'primary')
- `size`: 'small' | 'medium' | 'large' (default: 'medium')
- All standard HTML button attributes

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build the library
pnpm build
```

## License

MIT 