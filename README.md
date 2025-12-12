# PIQ Labs - AI-Powered Portfolio Intelligence

A modern, institutional-grade portfolio analysis platform built with React. PIQ delivers AI-powered insights through a three-tier visualization system, making complex financial data accessible to retail investors.

## Live Demo

- **Production**: Deployed on Cloudflare Pages
- **Backend**: Heroku (Python FastAPI)

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Payments** | Stripe |
| **Hosting** | Cloudflare Pages |
| **Backend** | Python FastAPI (Heroku) |

## Features

### Portfolio Analysis
- **Real-time Analysis** - Live polling with progressive intervals
- **Health Score** - Apple Watch-style ring visualization (0-100)
- **Risk Metrics** - VaR, CVaR, volatility, Sharpe ratio
- **Monte Carlo Simulations** - Probability distributions and stress testing
- **Correlation Analysis** - Matrix visualization and cluster detection
- **Beta Analysis** - Market correlation and systematic risk
- **Sector Allocation** - Pie charts and concentration metrics

### Three-Tier View System
| Tier | Description | Target User |
|------|-------------|-------------|
| **Simple** | Key metrics at a glance | Beginners |
| **Analyst** | Deeper insights, strategy explanations, "why" behind recommendations | Intermediate |
| **Quant** | Full data transparency, raw calculations, regression metadata | Advanced |

### Portfolio Management
- **Portfolio Switcher** - Quick switch between portfolios from HeroCard
- **Session Selector** - Resume previous analyses or start new ones
- **New Portfolio Wizard** - 3-step creation flow
- **Quick Demo** - Sample portfolio for new users

### Optimization Engine
- **Strategy Generation** - AI-powered portfolio recommendations
- **Risk Decomposition** - Systematic vs idiosyncratic risk breakdown
- **Implementation Guidance** - Step-by-step rebalancing instructions
- **Stress Testing** - Historical crisis scenarios (2008, COVID, etc.)
- **Correlation Stress Analysis** - Diversification breakdown risk

### User Experience
- **iOS-style Glass Morphism** - Modern, clean design language
- **Dark Mode** - Full dark theme support
- **Command Palette** - Cmd+K / Ctrl+K for power users
- **Guided Tour** - 10-step onboarding for new users
- **Educational Tooltips** - Learn financial concepts as you explore
- **Learn More Modal** - Searchable financial glossary
- **Toast Notifications** - Non-intrusive feedback

### Mobile Experience
- **Responsive Layout** - Optimized for all screen sizes
- **Bottom Navigation** - iOS-style tab bar (Overview, Risk, Holdings, Optimize, More)
- **Mobile Header** - Search, Notifications, and Menu icons
- **Touch-Optimized** - Tap targets and gestures
- **Compact Action Buttons** - 3-column grid for quick actions

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/alpery74/piq-web.git
cd piq-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

The API URL is hardcoded to the production backend:
```
https://piq-2025-8fc430488343.herokuapp.com/api
```

For local development with a local backend, modify `src/services/client.js`.

## Project Structure

```
src/
├── components/
│   ├── common/                    # Shared UI components
│   │   ├── BackendStatus.jsx      # Server warmup indicator
│   │   ├── CommandPalette.jsx     # Cmd+K search interface
│   │   ├── EducationalTooltip.jsx # Info tooltips with definitions
│   │   ├── HeroCard.jsx           # Portfolio summary card
│   │   ├── LearnMoreModal.jsx     # Financial glossary modal
│   │   ├── MobileBottomNav.jsx    # iOS-style bottom tabs
│   │   ├── OnboardingWizard.jsx   # Guided tour system
│   │   ├── SettingsModal.jsx      # User preferences
│   │   └── Skeleton.jsx           # Loading placeholders
│   │
│   ├── dashboard/                 # Dashboard-specific components
│   │   ├── AnalysisProgressCard.jsx
│   │   ├── CorrelationClustersCard.jsx
│   │   ├── ExpandableSection.jsx
│   │   ├── FundamentalsCard.jsx
│   │   ├── GoalsSection.jsx
│   │   ├── HealthSection.jsx
│   │   ├── HoldingsSection.jsx
│   │   ├── ImplementationSection.jsx
│   │   ├── InsightsSection.jsx
│   │   ├── NewAnalysisModal.jsx
│   │   ├── RiskOverviewCard.jsx
│   │   ├── SessionSelectorDialog.jsx
│   │   ├── StrategyComparisonCard.jsx
│   │   └── WhatIfSimulator.jsx
│   │
│   └── layout/
│       └── Layout.jsx             # Main layout wrapper
│
├── context/
│   ├── AuthContext.jsx            # Authentication state
│   ├── ThemeContext.jsx           # Dark/light mode
│   └── ToastContext.jsx           # Notification toasts
│
├── hooks/
│   └── useAnalysisPolling.js      # Real-time analysis polling
│
├── pages/
│   ├── Dashboard.jsx              # Main dashboard
│   ├── Login.jsx                  # Authentication
│   ├── Logout.jsx                 # Sign out
│   ├── Legal.jsx                  # Terms & disclaimers
│   └── Privacy.jsx                # Privacy policy
│
├── services/
│   ├── analysisService.js         # Analysis API calls
│   ├── api.js                     # Base API configuration
│   ├── client.js                  # HTTP client
│   └── stripe.js                  # Payment integration
│
├── utils/
│   └── formatters.js              # Number/date formatting
│
├── App.jsx                        # Root component
├── index.css                      # Global styles
└── main.jsx                       # Entry point
```

## Design System

### Brand Colors (iOS-inspired)

| Color | Variable | Hex | Usage |
|-------|----------|-----|-------|
| Blue | `--ios-blue` | `#007AFF` | Primary actions, links, active states |
| Green | `--ios-green` | `#34C759` | Success, positive changes, health scores |
| Orange | `--ios-orange` | `#FF9500` | Warnings, moderate risk, caution |
| Red | `--ios-red` | `#FF3B30` | Errors, negative changes, high risk |
| Purple | `--ios-purple` | `#AF52DE` | Quant view, advanced features |

### Light Mode Color Schema

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| **Backgrounds** | | |
| Page Background | `#F5F5F7` | `bg-gray-50` |
| Card Background | `#FFFFFF` | `bg-white` |
| Card Elevated | `#FFFFFF` | `bg-white` |
| Input Background | `#F5F5F7` | `bg-gray-50` |
| Hover State | `#F0F0F5` | `bg-gray-100` |
| **Text** | | |
| Primary Text | `#1D1D1F` | `text-gray-900` |
| Secondary Text | `#6E6E73` | `text-gray-600` |
| Muted Text | `#8E8E93` | `text-gray-500` |
| Placeholder | `#AEAEB2` | `text-gray-400` |
| **Borders** | | |
| Default Border | `#E5E5EA` | `border-gray-200` |
| Subtle Border | `#F2F2F7` | `border-gray-100` |
| Focus Border | `#007AFF` | `border-primary-500` |
| **Surfaces** | | |
| Modal Overlay | `rgba(0,0,0,0.5)` | `bg-black/50` |
| Glass Effect | `rgba(255,255,255,0.8)` | `bg-white/80` |
| Tooltip | `#1D1D1F` | `bg-gray-900` |

### Dark Mode Color Schema

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| **Backgrounds** | | |
| Page Background | `#0A0B0D` | `dark:bg-gray-950` |
| Card Background | `#141417` | `dark:bg-gray-900` |
| Card Elevated | `#1C1C21` | `dark:bg-gray-800` |
| Input Background | `#1C1C21` | `dark:bg-gray-800` |
| Hover State | `#2C2C31` | `dark:bg-gray-700` |
| **Text** | | |
| Primary Text | `#FFFFFF` | `dark:text-white` |
| Secondary Text | `#A1A1A6` | `dark:text-gray-400` |
| Muted Text | `#8E8E93` | `dark:text-gray-500` |
| Placeholder | `#636366` | `dark:text-gray-600` |
| **Borders** | | |
| Default Border | `#38383A` | `dark:border-gray-700` |
| Subtle Border | `#2C2C2E` | `dark:border-gray-800` |
| Focus Border | `#0A84FF` | `dark:border-primary-400` |
| **Surfaces** | | |
| Modal Overlay | `rgba(0,0,0,0.7)` | `dark:bg-black/70` |
| Glass Effect | `rgba(20,20,23,0.8)` | `dark:bg-gray-900/80` |
| Tooltip | `#F5F5F7` | `dark:bg-gray-100` |

### Semantic Colors

| State | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| Success BG | `#D1FAE5` | `rgba(52,199,89,0.2)` | Positive indicators |
| Success Text | `#065F46` | `#34C759` | Success messages |
| Warning BG | `#FEF3C7` | `rgba(255,149,0,0.2)` | Caution indicators |
| Warning Text | `#92400E` | `#FF9500` | Warning messages |
| Error BG | `#FEE2E2` | `rgba(255,59,48,0.2)` | Error indicators |
| Error Text | `#991B1B` | `#FF3B30` | Error messages |
| Info BG | `#DBEAFE` | `rgba(0,122,255,0.2)` | Information indicators |
| Info Text | `#1E40AF` | `#007AFF` | Info messages |

### Risk Level Colors

| Level | Light Mode | Dark Mode | Health Score |
|-------|------------|-----------|--------------|
| Excellent | `#34C759` | `#30D158` | 80-100 |
| Good | `#34C759` | `#30D158` | 60-79 |
| Moderate | `#FF9500` | `#FF9F0A` | 40-59 |
| Poor | `#FF3B30` | `#FF453A` | 0-39 |

### Glass Effects

```css
/* Header navigation */
.nav-glass {
  background: rgba(255, 255, 255, 0.8);  /* Light */
  background: rgba(20, 20, 23, 0.8);     /* Dark */
  backdrop-filter: blur(20px);
}

/* Standard cards */
.card-glass {
  background: rgba(255, 255, 255, 0.7);  /* Light */
  background: rgba(28, 28, 33, 0.7);     /* Dark */
  backdrop-filter: blur(10px);
}

/* Hero card with gradient */
.card-glass-hero {
  background: linear-gradient(135deg,
    rgba(255,255,255,0.9),
    rgba(245,245,247,0.9));              /* Light */
  background: linear-gradient(135deg,
    rgba(20,20,23,0.9),
    rgba(28,28,33,0.9));                 /* Dark */
}
```

### View Tier Colors

| Tier | Badge Color | Icon Color | Active State |
|------|-------------|------------|--------------|
| Simple | Gray | `text-gray-600` | `bg-gray-100` |
| Analyst | Blue | `text-blue-600` | `bg-blue-600 text-white` |
| Quant | Purple | `text-purple-600` | `bg-purple-600 text-white` |

## Key Components

### HeroCard
Portfolio summary displaying:
- Total portfolio value (animated)
- Daily change ($ and %)
- Health score ring (0-100)
- Portfolio switcher button
- Quick action buttons (Optimize, Goals, Export)

### RiskOverviewCard
Risk metrics including:
- Volatility (annualized %)
- VaR/CVaR (95% daily)
- Sharpe ratio
- Monte Carlo projections
- Stress test scenarios
- Regression analysis (Quant view)
- Correlation breakdown risk (Quant view)

### SessionSelectorDialog
Portfolio selection with:
- Continue last analysis
- New portfolio creation
- Quick demo option
- Portfolio library with versions
- Run ID input for direct access

### Command Palette
Power user features:
- Section navigation (1-4 shortcuts)
- Portfolio actions (Switch, New, Demo)
- View tier switching
- Theme toggle
- Guided tour restart

## API Integration

### Backend Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /analyze` | Start new analysis |
| `GET /analysis/{run_id}` | Get analysis results |
| `GET /portfolio-library` | List user portfolios |
| `GET /search-company` | Company ticker search |
| `POST /create-checkout-session` | Stripe checkout |

### Analysis Data Categories

| Category | Key Fields |
|----------|------------|
| `math_correlation` | beta, R-squared, correlation matrix |
| `math_risk_metrics` | HHI, Gini, sector concentration |
| `math_volatility` | VaR, CVaR, Sharpe, simulations |
| `optimization_risk_decomposition` | systematic/idiosyncratic risk |
| `optimization_strategy_generation` | recommended strategies |
| `optimization_implementation` | trade sequence, tax efficiency |
| `optimization_stress_testing` | Monte Carlo, crisis scenarios |

### Polling Strategy

The `useAnalysisPolling` hook implements:
- Progressive polling intervals (1s → 2s → 5s → 10s)
- WebSocket-style reconnection
- Partial result handling
- Error recovery with retry

## Subscription Tiers

| Plan | Price | Holdings | Analyses/Month |
|------|-------|----------|----------------|
| Free | $0 | 5 | 5 |
| Basic | $2.99/mo | 20 | 10 |
| Plus | $5.99/mo | 40 | 20 |

## Deployment

### Cloudflare Pages

```bash
# Build and deploy
npm run build
npx wrangler pages deploy dist --project-name=piq-website
```

### Environment

- **Node**: 18+
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome for Android

## Contributing

This is a proprietary project. Please contact PIQ Labs for contribution guidelines.

## License

Proprietary - PIQ Labs 2025

## Support

- **Email**: support@piqlabs.com
- **Issues**: GitHub Issues
- **Documentation**: In-app guided tour and tooltips
