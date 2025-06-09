# Vybe Challenge

- [Setup Instructions](./docs/SETUP_INSTRUCTIONS.md)

## Architecture

The frontend is built with React, TypeScript, Tailwind CSS (Shadcn UI), and Vite.
The backend is a Node.js API built with Hono.

- React Query for data fetching and caching
- ApexCharts for data visualization
- React Testing Library and Vitest for frontend testing
- Redis for caching API responses and rate limiting
- Docker for containerization
- Monorepo managed with Turborepo and PNPM workspaces

### Frontend

There is a single dashboard page with three chart components displayed using Tabs:

- **MarketCapChart**: Pie chart of the market cap distribution of 5 SPL tokens.
- **WalletBalanceChart**: Bar chart showing SOL balances for 10 wallets.
- **TPSChart**: Time series chart of Solana transactions per second (TPS).

#### Frontend Optimizations

- React Query fetch intervals are synchronized with Redis TTL to avoid unnecessary API calls.
- Charts have fixed height and width to prevent layout shifts.

### API Design & Implementation

- **Versioned Routing**: All endpoints are prefixed with `/api/v1` for future-proofing.
- **Modular Architecture**: Separate routers/controllers for each domain improve code organization and scalability.
- **Caching & Rate Limiting**: Redis caches expensive computations and applies rate limits, boosting performance and protecting backend resources.
- **Centralized Error Handling**: Errors are captured and formatted using Pino.

#### Endpoints

- **GET `/api/v1/token/bullish`**: Returns market cap and metadata for a set of 5 SPL tokens, batched for efficiency. Market cap is calculated by multiplying current supply by the price from CoinGecko.
- **GET `/api/v1/metrics/tps`**: Returns historical TPS data using Solana’s `getRecentPerformanceSamples` for efficient 60-second snapshots, minimizing RPC overhead.
- **GET `/api/v1/wallet/balances`**: Returns SOL balances for multiple wallets using `getMultipleAccountsInfo` to reduce RPC calls and improve performance by fetching all balances in one request.

### Build & Deployment

The monorepo is structured using Turborepo and PNPM workspaces, with Docker handling containerization.

- A multi-stage Docker build is used for efficient image creation.
- The backend server serves both the static frontend assets and API routes from a single container.
