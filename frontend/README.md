# CodeTrace Frontend

AI-Powered Bug Detection Tool - React Frontend

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Vanilla CSS** - Styling (no frameworks)

## Project Structure

```
frontend/
├── public/              # Static assets
│   ├── hero.html        # Hero animation (standalone)
│   ├── style.css        # Hero styles
│   └── script.js        # Hero animation logic
├── src/
│   ├── components/      # React components
│   │   ├── Sidebar.jsx/.css
│   │   ├── UploadSection.jsx/.css
│   │   └── Footer.jsx/.css
│   ├── constants/       # App configuration
│   │   └── index.js
│   ├── hooks/           # Custom React hooks
│   │   └── index.js
│   ├── App.jsx          # Main app component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

### Hero Animation

The hero animation is a self-contained HTML/CSS/JS bundle in `public/`. It communicates with the React app via `postMessage`:

- `hero-complete` - Sent when animation finishes → React shows main content
- `hero-relock` - Sent when user scrolls up → React hides main content

### State Management

Uses React's built-in `useState` and custom hooks:

- `useScrollPosition` - Tracks scroll position for toggle visibility
- `useHeroMessages` - Listens for hero animation events

### Styling

- **BEM-like naming** for CSS classes
- **CSS Custom Properties** for theming (can be extended)
- **Mobile-responsive** with media queries

## Configuration

All configurable values are in `src/constants/index.js`:

- API URLs
- UI thresholds
- File upload limits
- App metadata

## TODO

- [ ] Connect to FastAPI backend
- [ ] Implement file upload API calls
- [ ] Add analysis results display
- [ ] Add history feature with localStorage
- [ ] Add loading states and error handling
