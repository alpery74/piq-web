# PIQ Labs - Portfolio Analysis Web Application

Modern React-based web interface for the PIQ portfolio analysis platform. The dashboard currently renders against mocked portfolio analysis data while backend integration is being wired.

## UI/UX Highlights

- Sticky header with compact navigation: Coach/Analyst/Quant anchor pills with active state and scrollspy, plus a subtle Quant View toggle.
- Section bands for quick scanning: Health (amber), Insights (blue), Holdings (neutral) separated into full-width tints with lead-in icons.
- Updated branding: header and favicon now use `/public/images/logo.svg`.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Charts**: Recharts (lightweight, React-native)
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios
- **Hosting**: Cloudflare Pages (Free Tier)
- **Backend**: Flask on Heroku (your existing endpoints)

## Why This Stack?

1. **Cloudflare Pages Free Tier**: Unlimited bandwidth, automatic SSL, global CDN
2. **Vite**: Lightning-fast builds, excellent DX, perfect for Cloudflare
3. **React**: Component reusability for your complex data visualizations
4. **Tailwind**: Rapid development with consistent design system
5. **Recharts**: Lightweight (40kb), built for React, handles your data viz needs

## Project Structure

```
piq-website/
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI (Card, Badge, Tooltip)
│   │   ├── dashboard/          # Dashboard subcomponents (Health/Insights/Holdings, ExpandableSection, InfoTooltip)
│   │   └── layout/             # Shared shell (header/footer)
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main experience (mocked data today)
│   │   ├── Legal.jsx           # Static legal copy
│   │   └── Privacy.jsx         # Static privacy copy
│   ├── services/
│   │   └── api.js              # Axios instance + analysis endpoints
│   ├── utils/
│   │   └── formatters.js       # Formatting helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── legal.html              # Your existing legal page (preserved)
├── privacy.html            # Your existing privacy page (preserved)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages

```bash
npm run build
# Then upload the 'dist' folder to Cloudflare Pages
```

## Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=https://your-heroku-app.herokuapp.com/api
VITE_ENV=production
```

## Data & API Notes

- The dashboard reads live analysis results via `/session/{analysisRunId}/results` with progressive polling and snake→camel parsing. All API calls are centralized in `src/services/analysisService.js` and `src/services/client.js` (axios with auth token handling).
- Set `VITE_API_BASE_URL` to your Heroku API root; the default falls back to the hosted `piq-2025-8fc430488343.herokuapp.com/api`.
- If you add new API calls, keep them in `services/` and mirror existing error handling.

## Development Notes

- ESLint is configured via `npm run lint`, but no `.eslintrc` is present in the repo. Add one if you want linting enforced locally; otherwise expect the command to error out.

## Cloudflare Pages Setup

1. Connect your GitHub repo to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Environment variables: Add your Heroku backend URL

## API Integration

The app expects these Flask endpoints:

- GET `/api/math_correlation`
- GET `/api/math_risk_metrics`
- GET `/api/math_performance`
- GET `/api/math_volatility`
- GET `/api/optimization/risk_decomposition`
- GET `/api/optimization/strategy_generation`
- GET `/api/optimization/implementation`
- GET `/api/optimization/stress_testing`

## Cost Breakdown

**Cloudflare Pages**: FREE
- Unlimited sites
- Unlimited bandwidth
- 500 builds/month
- Automatic SSL
- Global CDN

**Total Monthly Cost**: $0 (using free tier)

## Performance Targets

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 90+
