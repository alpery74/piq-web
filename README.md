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

### Color Palette (iOS-inspired)

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | `#007AFF` | Primary actions, links |
| Green | `#34C759` | Success, positive changes |
| Orange | `#FF9500` | Warnings, moderate risk |
| Red | `#FF3B30` | Errors, negative changes |
| Purple | `#AF52DE` | Quant view, advanced features |

### Dark Mode Colors

| Element | Light | Dark |
|---------|-------|------|
| Background | `#F5F5F7` | `#0A0B0D` |
| Card | `white` | `#141417` |
| Text | `gray-900` | `white` |
| Border | `gray-200` | `gray-700` |

### Glass Effects

```css
.nav-glass     /* Header glass effect */
.card-glass    /* Standard card effect */
.card-glass-hero /* Hero card with gradient */
```

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
