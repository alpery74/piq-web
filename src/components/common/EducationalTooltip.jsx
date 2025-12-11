import { useState, useRef, useEffect } from 'react';
import { HelpCircle, BookOpen, TrendingUp, TrendingDown, AlertTriangle, Shield, Target, Percent, BarChart3, PieChart, Activity, Zap } from 'lucide-react';

/**
 * Financial Terms Dictionary
 * Comprehensive explanations for novice investors
 */
export const FINANCIAL_TERMS = {
  // Risk Metrics
  beta: {
    term: 'Beta (β)',
    short: 'How much your investment moves with the market',
    full: 'Beta measures how sensitive an investment is to market movements. A beta of 1.0 means it moves exactly with the market. Beta > 1 means more volatile than the market, beta < 1 means less volatile.',
    example: 'If a stock has β = 1.5 and the market rises 10%, the stock typically rises 15%. If the market falls 10%, it falls 15%.',
    range: {
      low: { value: '< 0.8', label: 'Defensive', color: '#34C759' },
      mid: { value: '0.8 - 1.2', label: 'Market-like', color: '#FF9500' },
      high: { value: '> 1.2', label: 'Aggressive', color: '#FF3B30' },
    },
    icon: TrendingUp,
    category: 'risk',
  },

  volatility: {
    term: 'Volatility',
    short: 'How much prices swing up and down',
    full: 'Volatility measures the degree of price variation over time. Higher volatility means bigger price swings (both up and down). It\'s typically expressed as an annualized percentage.',
    example: '20% annual volatility means prices typically swing within ±20% of the average over a year.',
    range: {
      low: { value: '< 15%', label: 'Low', color: '#34C759' },
      mid: { value: '15-25%', label: 'Moderate', color: '#FF9500' },
      high: { value: '> 25%', label: 'High', color: '#FF3B30' },
    },
    icon: Activity,
    category: 'risk',
  },

  sharpeRatio: {
    term: 'Sharpe Ratio',
    short: 'Return per unit of risk taken',
    full: 'The Sharpe Ratio measures risk-adjusted returns. It shows how much excess return you receive for the extra volatility you endure. Higher is better.',
    example: 'Sharpe of 1.0 = good, 2.0 = very good, 3.0 = excellent. Negative means you\'re losing money relative to a risk-free investment.',
    range: {
      low: { value: '< 0.5', label: 'Poor', color: '#FF3B30' },
      mid: { value: '0.5 - 1.0', label: 'Acceptable', color: '#FF9500' },
      high: { value: '> 1.0', label: 'Good', color: '#34C759' },
    },
    icon: Target,
    category: 'performance',
  },

  var: {
    term: 'Value at Risk (VaR)',
    short: 'Maximum expected loss on a bad day',
    full: 'VaR estimates the maximum loss you might experience over a given time period with a certain confidence level. VaR 95% means there\'s only a 5% chance of losing more than this amount.',
    example: 'If daily VaR 95% is 2%, then 95% of days your loss won\'t exceed 2%. But 1 in 20 days, it could be worse.',
    icon: AlertTriangle,
    category: 'risk',
  },

  cvar: {
    term: 'Conditional VaR (CVaR)',
    short: 'Average loss when things go really bad',
    full: 'CVaR (also called Expected Shortfall) measures the average loss in the worst-case scenarios beyond VaR. It answers: "When losses exceed VaR, how bad does it get on average?"',
    example: 'If CVaR 95% is 3.5% and VaR is 2%, it means when you do lose more than 2%, the average loss is 3.5%.',
    icon: AlertTriangle,
    category: 'risk',
  },

  // Correlation & Diversification
  correlation: {
    term: 'Correlation',
    short: 'How investments move together',
    full: 'Correlation measures the relationship between two investments\' price movements. Ranges from -1 (move opposite) to +1 (move together). Low correlation = better diversification.',
    example: 'Correlation of 0.8 means when one goes up, the other usually goes up too. -0.5 means they often move in opposite directions.',
    range: {
      low: { value: '< 0.3', label: 'Low (Good)', color: '#34C759' },
      mid: { value: '0.3 - 0.7', label: 'Moderate', color: '#FF9500' },
      high: { value: '> 0.7', label: 'High (Risky)', color: '#FF3B30' },
    },
    icon: PieChart,
    category: 'diversification',
  },

  rSquared: {
    term: 'R-Squared (R²)',
    short: 'How much of your returns are explained by the market',
    full: 'R² shows what percentage of your portfolio\'s movement can be explained by market movements. Low R² means your returns are driven by stock-specific factors, not the overall market.',
    example: 'R² of 0.80 means 80% of your portfolio\'s ups and downs are due to the market, and 20% is from your specific stock picks.',
    range: {
      low: { value: '< 0.3', label: 'Independent', color: '#007AFF' },
      mid: { value: '0.3 - 0.7', label: 'Mixed', color: '#FF9500' },
      high: { value: '> 0.7', label: 'Market-driven', color: '#8E8E93' },
    },
    icon: BarChart3,
    category: 'diversification',
  },

  diversificationRatio: {
    term: 'Diversification Ratio',
    short: 'How effectively your holdings reduce risk',
    full: 'Measures how much risk is reduced by combining assets vs holding them individually. Higher ratio = better diversification benefit.',
    example: 'Ratio of 1.5 means your portfolio is 50% less risky than if you held each position separately with no diversification.',
    icon: Shield,
    category: 'diversification',
  },

  effectiveHoldings: {
    term: 'Effective Holdings',
    short: 'How many stocks your portfolio behaves like',
    full: 'Adjusts for concentration. Even with 10 stocks, if one is 50% of the portfolio, you\'re not really diversified across 10 stocks. This metric shows the "effective" number.',
    example: '10 stocks with equal weights = 10 effective holdings. 10 stocks where one is 90% = closer to 1-2 effective holdings.',
    icon: PieChart,
    category: 'diversification',
  },

  // Concentration
  hhi: {
    term: 'HHI (Concentration Index)',
    short: 'How concentrated your portfolio is',
    full: 'Herfindahl-Hirschman Index measures concentration. Ranges from 0 (perfectly spread) to 1 (all in one stock). Lower is generally better for diversification.',
    example: 'HHI of 0.10 = well diversified. HHI of 0.25 = moderately concentrated. HHI of 0.50+ = highly concentrated.',
    range: {
      low: { value: '< 0.15', label: 'Diversified', color: '#34C759' },
      mid: { value: '0.15 - 0.25', label: 'Moderate', color: '#FF9500' },
      high: { value: '> 0.25', label: 'Concentrated', color: '#FF3B30' },
    },
    icon: PieChart,
    category: 'concentration',
  },

  // Risk Decomposition
  systematicRisk: {
    term: 'Systematic Risk',
    short: 'Risk from the overall market',
    full: 'Also called "market risk" - this is risk that affects all investments and cannot be diversified away. Examples: recessions, interest rate changes, geopolitical events.',
    example: 'During a market crash, even well-diversified portfolios lose value. That\'s systematic risk in action.',
    icon: TrendingDown,
    category: 'risk',
  },

  idiosyncraticRisk: {
    term: 'Idiosyncratic Risk',
    short: 'Risk specific to your stock picks',
    full: 'Also called "stock-specific risk" - this is risk unique to individual companies that CAN be diversified away by holding more stocks.',
    example: 'A company\'s CEO resigns, causing its stock to drop 20% while the market is flat. That\'s idiosyncratic risk.',
    icon: Zap,
    category: 'risk',
  },

  marginalContribution: {
    term: 'Marginal Risk Contribution',
    short: 'How much each stock adds to total portfolio risk',
    full: 'Shows each position\'s contribution to overall portfolio volatility. A stock can have high individual volatility but low contribution if it\'s uncorrelated with other holdings.',
    example: 'Stock A is 20% of portfolio but contributes 40% of risk = disproportionately risky position.',
    icon: BarChart3,
    category: 'risk',
  },

  // Optimization
  minimumVariance: {
    term: 'Minimum Variance Portfolio',
    short: 'Weights that minimize total risk',
    full: 'An optimization strategy that finds the portfolio weights resulting in the lowest possible volatility, regardless of expected returns.',
    example: 'If current volatility is 20% and minimum variance is 12%, you could reduce risk by 40% with different weights.',
    icon: Shield,
    category: 'optimization',
  },

  riskParity: {
    term: 'Risk Parity',
    short: 'Equal risk contribution from each holding',
    full: 'A strategy where each position contributes equally to portfolio risk. Low-volatility assets get higher weights, high-volatility assets get lower weights.',
    example: 'Instead of equal dollar amounts, you size positions so each adds the same amount of risk.',
    icon: Target,
    category: 'optimization',
  },

  maxDiversification: {
    term: 'Maximum Diversification',
    short: 'Weights that maximize diversification benefit',
    full: 'Optimizes for the highest diversification ratio - maximizing the risk reduction benefit from combining assets.',
    example: 'Overweights assets that are least correlated with the rest of the portfolio.',
    icon: Shield,
    category: 'optimization',
  },

  turnover: {
    term: 'Turnover',
    short: 'How much trading is needed',
    full: 'The percentage of portfolio that needs to be bought or sold to implement a strategy. Higher turnover = more trading costs and potential tax implications.',
    example: '20% turnover means you need to trade 20% of your portfolio value.',
    icon: Activity,
    category: 'optimization',
  },

  // General
  portfolioValue: {
    term: 'Portfolio Value',
    short: 'Total market value of all holdings',
    full: 'The sum of current market values for all positions in your portfolio.',
    icon: TrendingUp,
    category: 'general',
  },

  weight: {
    term: 'Position Weight',
    short: 'Percentage of portfolio in this holding',
    full: 'How much of your total portfolio value is invested in a particular stock or asset.',
    example: '$10,000 in AAPL out of $100,000 total = 10% weight.',
    icon: Percent,
    category: 'general',
  },

  drawdown: {
    term: 'Drawdown',
    short: 'Peak-to-trough decline',
    full: 'The maximum loss from a peak to a trough before a new peak is achieved. Measures the worst decline you would have experienced.',
    example: 'If portfolio went from $100K to $75K before recovering, max drawdown was 25%.',
    icon: TrendingDown,
    category: 'risk',
  },

  tailRisk: {
    term: 'Tail Risk',
    short: 'Risk of extreme, rare events',
    full: 'The probability of rare but severe losses (the "tails" of a probability distribution). High tail risk means occasional catastrophic losses.',
    example: 'A portfolio with high tail risk might have small losses most days but occasionally lose 15%+ in a single day.',
    range: {
      low: { value: 'Low', label: 'Normal distribution', color: '#34C759' },
      mid: { value: 'Moderate', label: 'Some fat tails', color: '#FF9500' },
      high: { value: 'High', label: 'Fat tails', color: '#FF3B30' },
    },
    icon: AlertTriangle,
    category: 'risk',
  },

  // ============================================
  // LIQUIDITY & IMPLEMENTATION
  // ============================================

  liquidity: {
    term: 'Liquidity',
    short: 'How easily you can buy/sell without affecting price',
    full: 'Liquidity measures how quickly and easily an asset can be bought or sold at a stable price. High liquidity means you can trade large amounts without significantly moving the market price.',
    example: 'Apple stock (AAPL) is highly liquid - you can sell millions of shares quickly. A small-cap penny stock might be illiquid - selling even 1,000 shares could drop the price.',
    range: {
      low: { value: 'Illiquid', label: '<$100M cap', color: '#FF3B30' },
      mid: { value: 'Moderate', label: '$100M-$10B', color: '#FF9500' },
      high: { value: 'Liquid', label: '>$10B cap', color: '#34C759' },
    },
    icon: Activity,
    category: 'implementation',
  },

  marketCap: {
    term: 'Market Capitalization',
    short: 'Total value of a company\'s shares',
    full: 'Market cap = share price × total shares outstanding. It represents the total market value of a company and is used to categorize stocks by size.',
    example: 'A company with 1 billion shares at $50 each has a $50B market cap (large-cap).',
    range: {
      low: { value: 'Small', label: '<$2B', color: '#FF9500' },
      mid: { value: 'Mid', label: '$2B-$10B', color: '#007AFF' },
      high: { value: 'Large', label: '>$10B', color: '#34C759' },
    },
    icon: BarChart3,
    category: 'fundamentals',
  },

  bidAskSpread: {
    term: 'Bid-Ask Spread',
    short: 'Cost to trade immediately',
    full: 'The difference between what buyers will pay (bid) and sellers will accept (ask). Wider spreads mean higher implicit trading costs.',
    example: 'If bid is $99.90 and ask is $100.10, the spread is $0.20 or 20 basis points. You lose this amount when buying and selling.',
    range: {
      low: { value: '<5 bps', label: 'Tight', color: '#34C759' },
      mid: { value: '5-20 bps', label: 'Normal', color: '#FF9500' },
      high: { value: '>20 bps', label: 'Wide', color: '#FF3B30' },
    },
    icon: Activity,
    category: 'implementation',
  },

  marketImpact: {
    term: 'Market Impact',
    short: 'Price movement caused by your trade',
    full: 'When you buy or sell a large amount, your order can move the market price against you. Larger positions in less liquid stocks have higher market impact.',
    example: 'Buying $1M of a stock might push the price up 0.5% while you\'re buying, increasing your average cost.',
    icon: TrendingUp,
    category: 'implementation',
  },

  implementationPhase: {
    term: 'Implementation Phase',
    short: 'Optimal timing for executing trades',
    full: 'Based on liquidity and position size, trades are phased to minimize market impact. Phase 1 (immediate) for liquid positions, Phase 2 (careful) for moderate, Phase 3 (gradual) for illiquid.',
    example: 'A large-cap stock can be traded immediately, but a nano-cap position should be sold gradually over 1-2 weeks.',
    range: {
      low: { value: 'Phase 1', label: 'Immediate', color: '#34C759' },
      mid: { value: 'Phase 2', label: '3-7 days', color: '#FF9500' },
      high: { value: 'Phase 3', label: '1-2 weeks', color: '#FF3B30' },
    },
    icon: Activity,
    category: 'implementation',
  },

  // ============================================
  // TAX EFFICIENCY
  // ============================================

  taxLossHarvesting: {
    term: 'Tax-Loss Harvesting',
    short: 'Selling losers to offset gains',
    full: 'A strategy where you sell investments at a loss to offset capital gains taxes. The loss can reduce your tax bill, and you can reinvest in similar (but not identical) securities.',
    example: 'If you have $10K in gains and $5K in losses, you only pay taxes on $5K net gains. The $5K loss "harvests" tax savings.',
    icon: Percent,
    category: 'tax',
  },

  capitalGains: {
    term: 'Capital Gains',
    short: 'Profit from selling investments',
    full: 'The profit realized when you sell an asset for more than you paid. Short-term gains (<1 year) are taxed as ordinary income; long-term gains (>1 year) have preferential rates.',
    example: 'Buy at $100, sell at $150 = $50 capital gain. If held >1 year, you might pay 15% instead of 37%.',
    range: {
      low: { value: 'Long-term', label: '0-20% tax', color: '#34C759' },
      mid: { value: 'Short-term', label: '10-37% tax', color: '#FF9500' },
    },
    icon: TrendingUp,
    category: 'tax',
  },

  washSaleRule: {
    term: 'Wash Sale Rule',
    short: 'IRS rule preventing immediate repurchase',
    full: 'If you sell a security at a loss and buy the same or "substantially identical" security within 30 days before or after, you cannot claim the loss for tax purposes.',
    example: 'Sell AAPL at a loss on Monday, buy it back on Friday = wash sale, loss disallowed.',
    icon: AlertTriangle,
    category: 'tax',
  },

  expenseRatio: {
    term: 'Expense Ratio',
    short: 'Annual fund operating cost',
    full: 'The percentage of assets deducted annually to cover fund management, administration, and marketing costs. Lower is better - these costs compound over time.',
    example: 'A 1% expense ratio on $100K = $1,000/year in fees. Over 30 years, this could cost you $100K+ in lost returns.',
    range: {
      low: { value: '<0.1%', label: 'Low cost', color: '#34C759' },
      mid: { value: '0.1-0.5%', label: 'Moderate', color: '#FF9500' },
      high: { value: '>0.5%', label: 'High cost', color: '#FF3B30' },
    },
    icon: Percent,
    category: 'fundamentals',
  },

  // ============================================
  // FUNDAMENTALS & VALUATION
  // ============================================

  peRatio: {
    term: 'P/E Ratio',
    short: 'Price relative to earnings',
    full: 'Price-to-Earnings ratio = stock price ÷ earnings per share. Shows how much investors pay for each dollar of earnings. Higher P/E suggests growth expectations.',
    example: 'P/E of 20 means you pay $20 for every $1 of annual earnings. Tech growth stocks often have P/E >30; value stocks might be <15.',
    range: {
      low: { value: '<15', label: 'Value', color: '#34C759' },
      mid: { value: '15-25', label: 'Fair', color: '#FF9500' },
      high: { value: '>25', label: 'Growth', color: '#007AFF' },
    },
    icon: BarChart3,
    category: 'fundamentals',
  },

  dividendYield: {
    term: 'Dividend Yield',
    short: 'Annual income as % of price',
    full: 'Annual dividends per share ÷ share price. Shows the income return on your investment separate from price appreciation.',
    example: 'A $100 stock paying $3/year in dividends has a 3% yield. REITs often yield 4-6%; growth stocks may pay 0%.',
    range: {
      low: { value: '<2%', label: 'Low yield', color: '#8E8E93' },
      mid: { value: '2-4%', label: 'Moderate', color: '#FF9500' },
      high: { value: '>4%', label: 'High yield', color: '#34C759' },
    },
    icon: Percent,
    category: 'fundamentals',
  },

  sectorConcentration: {
    term: 'Sector Concentration',
    short: 'How much is in one industry',
    full: 'The percentage of your portfolio invested in a single sector (tech, healthcare, real estate, etc.). High sector concentration increases vulnerability to industry-specific risks.',
    example: 'If 50% of your portfolio is in tech stocks, a tech sector downturn will hit you harder than a diversified portfolio.',
    range: {
      low: { value: '<20%', label: 'Diversified', color: '#34C759' },
      mid: { value: '20-35%', label: 'Moderate', color: '#FF9500' },
      high: { value: '>35%', label: 'Concentrated', color: '#FF3B30' },
    },
    icon: PieChart,
    category: 'diversification',
  },

  // ============================================
  // STRESS TESTING & SCENARIOS
  // ============================================

  monteCarloSimulation: {
    term: 'Monte Carlo Simulation',
    short: 'Thousands of random future scenarios',
    full: 'A statistical technique that runs thousands of simulations with random market movements to estimate the range of possible portfolio outcomes.',
    example: 'By simulating 10,000 possible futures, we can say there\'s a 95% chance your portfolio stays above a certain value.',
    icon: Activity,
    category: 'stress_testing',
  },

  stressTest: {
    term: 'Stress Test',
    short: 'Performance in extreme scenarios',
    full: 'Analyzing how your portfolio would perform under extreme but plausible market conditions like crashes, recessions, or sector-specific crises.',
    example: 'In a 2008-style crisis (40% market drop), your portfolio might lose 35% based on its beta and correlations.',
    range: {
      low: { value: 'Normal', label: '70% probability', color: '#34C759' },
      mid: { value: 'Stress', label: '25% probability', color: '#FF9500' },
      high: { value: 'Crisis', label: '5% probability', color: '#FF3B30' },
    },
    icon: AlertTriangle,
    category: 'stress_testing',
  },

  probabilityOfLoss: {
    term: 'Probability of Loss',
    short: 'Chance of losing money over a period',
    full: 'Based on Monte Carlo simulations, this estimates the likelihood that your portfolio will be worth less at the end of the period than at the beginning.',
    example: 'A 52% probability of loss over 1 year means about half the simulated scenarios resulted in a negative return.',
    icon: AlertTriangle,
    category: 'stress_testing',
  },

  // ============================================
  // CORRELATION CLUSTERS
  // ============================================

  correlationCluster: {
    term: 'Correlation Cluster',
    short: 'Stocks that move together',
    full: 'Groups of stocks in your portfolio that tend to move in the same direction at the same time, reducing diversification benefits within the cluster.',
    example: 'If AAPL, MSFT, and GOOGL all move together (correlation >0.7), they form a cluster and behave like one position during market stress.',
    icon: PieChart,
    category: 'diversification',
  },

  diversificationOpportunity: {
    term: 'Diversification Opportunity',
    short: 'Potential to spread risk better',
    full: 'When holdings have low correlation with each other, there\'s opportunity to benefit from diversification - one position\'s losses may be offset by another\'s gains.',
    example: 'Adding a bond fund (often negatively correlated with stocks) can reduce overall portfolio volatility.',
    icon: Shield,
    category: 'diversification',
  },

  // ============================================
  // POSITION LIMITS & RISK MANAGEMENT
  // ============================================

  positionLimit: {
    term: 'Position Limit',
    short: 'Maximum recommended weight',
    full: 'The maximum percentage of your portfolio that should be in any single position, calculated based on the stock\'s individual volatility and correlation with other holdings.',
    example: 'A volatile biotech stock might have a 3% limit, while a stable utility might have an 8% limit.',
    icon: Target,
    category: 'risk_management',
  },

  riskBudget: {
    term: 'Risk Budget',
    short: 'How much risk each position can take',
    full: 'Allocating a specific amount of portfolio risk to each position. High-conviction, low-correlation positions get larger risk budgets.',
    example: 'With a 20% total risk budget, you might allocate 5% each to 4 uncorrelated positions rather than all 20% to one.',
    icon: Target,
    category: 'risk_management',
  },

  trackingError: {
    term: 'Tracking Error',
    short: 'Deviation from a benchmark',
    full: 'The standard deviation of the difference between your portfolio returns and a benchmark (like the S&P 500). Higher tracking error means more active risk.',
    example: 'A 5% tracking error means your portfolio typically varies ±5% from the benchmark annually.',
    icon: Activity,
    category: 'performance',
  },

  alpha: {
    term: 'Alpha (α)',
    short: 'Excess return from skill',
    full: 'The portion of your return that exceeds what would be expected given your portfolio\'s risk level. Positive alpha suggests skilled management or stock picking.',
    example: 'If your portfolio returned 12% with a beta of 1.0 and the market returned 10%, your alpha is 2%.',
    range: {
      low: { value: '<0', label: 'Underperforming', color: '#FF3B30' },
      mid: { value: '0-2%', label: 'Market-like', color: '#FF9500' },
      high: { value: '>2%', label: 'Outperforming', color: '#34C759' },
    },
    icon: TrendingUp,
    category: 'performance',
  },

  // ============================================
  // MONTE CARLO & PERCENTILES
  // ============================================

  percentile: {
    term: 'Percentile',
    short: 'Where you stand compared to simulations',
    full: 'A percentile tells you what percentage of simulated outcomes were below a certain value. The 5th percentile is a pessimistic scenario; the 50th is median; the 95th is optimistic.',
    example: 'If the 5th percentile return is -15%, that means 95% of simulations performed better than -15%.',
    icon: BarChart3,
    category: 'stress_testing',
  },

  maxDrawdownDistribution: {
    term: 'Max Drawdown Distribution',
    short: 'Range of worst-case declines',
    full: 'Monte Carlo simulations produce a distribution of maximum drawdowns. The median shows typical worst case; the 95th percentile shows extreme but plausible scenarios.',
    example: 'Median max drawdown of -18% with 95th percentile of -35% means most scenarios see -18% worst decline, but 5% see worse than -35%.',
    icon: TrendingDown,
    category: 'stress_testing',
  },

  returnDistribution: {
    term: 'Return Distribution',
    short: 'Range of possible returns',
    full: 'The spread of simulated portfolio returns. Shows not just the expected return, but the full range of possible outcomes from pessimistic to optimistic.',
    example: 'If returns range from -20% (5th) to +35% (95th) with 8% median, outcomes are highly variable.',
    icon: Activity,
    category: 'stress_testing',
  },

  // ============================================
  // ADDITIONAL RISK TERMS
  // ============================================

  riskBalance: {
    term: 'Risk Balance',
    short: 'Split between market and stock-specific risk',
    full: 'Assesses whether your portfolio risk comes primarily from market movements (systematic) or individual stock picks (idiosyncratic). A balanced portfolio has both.',
    example: 'An "idiosyncratic heavy" portfolio\'s returns depend mostly on stock picking, not market direction.',
    range: {
      low: { value: 'Systematic', label: 'Market-driven', color: '#007AFF' },
      mid: { value: 'Balanced', label: 'Mixed sources', color: '#34C759' },
      high: { value: 'Idiosyncratic', label: 'Stock-driven', color: '#FF9500' },
    },
    icon: PieChart,
    category: 'risk',
  },

  implementationRisk: {
    term: 'Implementation Risk',
    short: 'Risk of executing your strategy',
    full: 'The potential for slippage, market impact, and execution costs when actually trading to achieve your target portfolio. Larger trades in less liquid stocks have higher implementation risk.',
    example: 'A strategy that requires trading $5M of a micro-cap stock has high implementation risk because the trade itself will move the price.',
    range: {
      low: { value: 'Low', label: '< 0.5% cost', color: '#34C759' },
      mid: { value: 'Moderate', label: '0.5-2% cost', color: '#FF9500' },
      high: { value: 'High', label: '> 2% cost', color: '#FF3B30' },
    },
    icon: AlertTriangle,
    category: 'implementation',
  },

  liquidityScore: {
    term: 'Liquidity Score',
    short: 'How easily positions can be traded',
    full: 'An aggregate score (0-100) measuring how easily your portfolio positions can be bought or sold. Higher scores indicate more liquid, easier-to-trade positions.',
    example: 'A score of 85 means most positions can be traded quickly with minimal market impact; 40 suggests significant trading challenges.',
    range: {
      low: { value: '< 40', label: 'Illiquid', color: '#FF3B30' },
      mid: { value: '40-70', label: 'Moderate', color: '#FF9500' },
      high: { value: '> 70', label: 'Liquid', color: '#34C759' },
    },
    icon: Activity,
    category: 'implementation',
  },

  transactionCost: {
    term: 'Transaction Cost',
    short: 'Total cost to execute trades',
    full: 'The sum of explicit costs (commissions) and implicit costs (spread, market impact) when buying or selling securities. Minimizing transaction costs improves net returns.',
    example: 'A $100K trade with 0.1% explicit and 0.3% implicit costs = $400 total transaction cost.',
    icon: Percent,
    category: 'implementation',
  },

  weightChange: {
    term: 'Weight Change',
    short: 'How much to adjust each position',
    full: 'The difference between your current position size and the recommended or target size. Positive means increase, negative means decrease.',
    example: 'If current weight is 15% and target is 10%, the weight change is -5 percentage points.',
    icon: Activity,
    category: 'optimization',
  },

  expectedReturn: {
    term: 'Expected Return',
    short: 'Anticipated average return',
    full: 'The weighted average of all possible returns, based on historical data or forecasts. Not a guarantee, but a probability-weighted estimate of future performance.',
    example: 'An expected return of 8% means on average, over many periods, you might earn around 8% annually.',
    icon: TrendingUp,
    category: 'performance',
  },

  confidenceInterval: {
    term: 'Confidence Interval',
    short: 'Range where true value likely falls',
    full: 'A range of values within which the true result is expected to fall with a certain probability. A 95% confidence interval means there\'s a 95% chance the true value is within that range.',
    example: 'Return of 8% ± 15% at 95% confidence means returns will likely be between -7% and +23%.',
    icon: Target,
    category: 'stress_testing',
  },
};

/**
 * Educational Tooltip Component
 * Hover or tap to learn about financial terms
 */
const EducationalTooltip = ({
  term,
  children,
  showIcon = true,
  iconSize = 14,
  placement = 'top',
  variant = 'default', // 'default', 'inline', 'card'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const termData = FINANCIAL_TERMS[term];

  // Calculate tooltip position
  useEffect(() => {
    if (!termData) return;
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top, left;

      // Calculate based on placement preference
      switch (placement) {
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + 8;
          break;
        default: // top
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      }

      // Keep within viewport
      if (left < 16) left = 16;
      if (left + tooltipRect.width > viewportWidth - 16) {
        left = viewportWidth - tooltipRect.width - 16;
      }
      if (top < 16) top = triggerRect.bottom + 8;
      if (top + tooltipRect.height > viewportHeight - 16) {
        top = triggerRect.top - tooltipRect.height - 8;
      }

      setPosition({ top, left });
    }
  }, [isOpen, placement, termData]);

  // Close on scroll or click outside
  useEffect(() => {
    if (!isOpen || !termData) return;

    const handleClose = () => setIsOpen(false);
    window.addEventListener('scroll', handleClose, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleClose);
    };
  }, [isOpen, termData]);

  // Early return if no term data (after hooks)
  if (!termData) {
    return children;
  }

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Inline variant - just underlined text with hover
  if (variant === 'inline') {
    return (
      <span className="relative inline-flex items-center">
        <span
          ref={triggerRef}
          className="border-b border-dashed border-ios-gray-3 cursor-help"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={handleToggle}
        >
          {children}
        </span>
        {isOpen && (
          <TooltipContent
            ref={tooltipRef}
            termData={termData}
            position={position}
          />
        )}
      </span>
    );
  }

  // Default variant - icon trigger
  return (
    <span className="relative inline-flex items-center gap-1">
      {children}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center justify-center rounded-full transition-colors hover:bg-ios-gray-5 p-0.5"
        style={{ color: 'rgba(60, 60, 67, 0.4)' }}
        aria-label={`Learn about ${termData.term}`}
      >
        {showIcon && <HelpCircle size={iconSize} />}
      </button>
      {isOpen && (
        <TooltipContent
          ref={tooltipRef}
          termData={termData}
          position={position}
        />
      )}
    </span>
  );
};

/**
 * Tooltip Content Component
 */
const TooltipContent = ({ termData, position, ref }) => {
  const Icon = termData.icon || BookOpen;

  return (
    <div
      ref={ref}
      className="fixed z-[100] w-80 max-w-[calc(100vw-32px)] animate-scale-in"
      style={{
        top: position.top,
        left: position.left,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-ios-xl p-4 shadow-ios-lg"
        style={{
          background: 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          border: '0.5px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-ios flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0, 122, 255, 0.2)' }}
          >
            <Icon className="w-5 h-5 text-ios-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-white">
              {termData.term}
            </h4>
            <p className="text-sm text-ios-blue">
              {termData.short}
            </p>
          </div>
        </div>

        {/* Full explanation */}
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {termData.full}
        </p>

        {/* Example */}
        {termData.example && (
          <div
            className="rounded-ios p-3 mb-3"
            style={{ background: 'rgba(255, 255, 255, 0.08)' }}
          >
            <p className="text-xs font-semibold text-ios-teal mb-1">Example</p>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {termData.example}
            </p>
          </div>
        )}

        {/* Range indicators */}
        {termData.range && (
          <div className="flex gap-2">
            {Object.entries(termData.range).map(([key, val]) => (
              <div
                key={key}
                className="flex-1 rounded-ios p-2 text-center"
                style={{ background: `${val.color}20` }}
              >
                <p className="text-xs font-bold" style={{ color: val.color }}>
                  {val.value}
                </p>
                <p className="text-2xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {val.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Category badge */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <span
            className="text-2xs uppercase tracking-wide font-semibold px-2 py-1 rounded-full"
            style={{
              background: 'rgba(142, 142, 147, 0.2)',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {termData.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EducationalTooltip;
