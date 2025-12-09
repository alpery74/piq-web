# PIQ Labs Website

A modern React + Vite + Tailwind CSS dashboard for AI-powered portfolio intelligence and analysis.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## Features

### Dashboard
- Real-time portfolio analysis with AI insights
- Interactive charts with 1D/1W/1M/3M/1Y time periods
- Health score visualization (Apple Watch-style ring)
- Risk analysis (VaR, CVaR, volatility, stress testing)
- Monte Carlo simulations
- Correlation matrices and cluster analysis
- Holdings breakdown with sector allocation

### View Tiers
- **Simple** - Key metrics at a glance
- **Analyst** - Deeper insights and context
- **Quant** - Full data transparency with raw calculations

### UX Features
- iOS-style glass morphism design
- Dark mode support
- Command palette (Cmd+K)
- Notification system
- User profile dropdown
- Educational tooltips
- Responsive mobile layout

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared UI components
│   │   ├── CommandPalette.jsx
│   │   ├── HeroCard.jsx
│   │   ├── SettingsModal.jsx
│   │   └── ...
│   ├── dashboard/       # Dashboard-specific components
│   │   ├── RiskOverviewCard.jsx
│   │   ├── HoldingsSection.jsx
│   │   ├── GoalsSection.jsx
│   │   └── ...
│   └── layout/          # Layout components
│       └── Layout.jsx
├── context/             # React contexts
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── ToastContext.jsx
├── hooks/               # Custom hooks
│   └── useAnalysisPolling.js
├── pages/               # Route pages
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Legal.jsx
│   └── Privacy.jsx
├── services/            # API services
│   ├── api.js
│   └── client.js
├── utils/               # Utility functions
│   └── formatters.js
├── App.jsx
└── index.css
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

## Design System

### Colors (iOS-inspired)
- `--ios-blue`: #007AFF
- `--ios-green`: #34C759
- `--ios-orange`: #FF9500
- `--ios-red`: #FF3B30
- `--ios-purple`: #AF52DE

### Glass Effects
- `nav-glass` - Header glass effect
- `card-glass` - Card glass effect
- `backdrop-blur-xl` - Heavy blur

## Key Components

### Layout.jsx
Main layout wrapper with:
- Sticky glass header with navigation
- User profile dropdown
- Notification bell with badge
- Search button (opens Command Palette)
- Settings button
- Social proof stats bar
- Trust badges footer

### Dashboard.jsx
Main dashboard page with:
- HeroCard (portfolio value, daily change, health score)
- Section navigation pills
- View tier selector (Simple/Analyst/Quant)
- Risk, Diversification, Fundamentals, Optimization sections

### HeroCard.jsx
Portfolio summary with:
- Animated portfolio value
- Daily change percentage
- Health ring visualization
- Quick action buttons

## API Integration

The app connects to a Python FastAPI backend for:
- Portfolio analysis
- Risk calculations
- Monte Carlo simulations
- Company search
- User authentication

Polling is handled via `useAnalysisPolling` hook with progressive intervals.

## License

Proprietary - PIQ Labs 2025
