# Vybe Full-Stack Code Challenge

## Challenge Description

Your task is to create a simple React application with a Node API backend, both implemented in TypeScript. The application will interact with the Solana blockchain to fetch data and display it on various charts. Explain your reasoning for each design decision in the code with comments. Please be descriptive.

### Backend - Node API

The backend will be a Node.js server deployed using a Docker container. It will interact with the Solana blockchain through the public RPC endpoint `https://solana-mainnet.rpc.extrnode.com/`. Provide an API that responds with real-time data to the frontend for three specific metrics: MarketCapDistribution, TransactionsPerSecond, and WalletBalance.

1. **MarketCapDistribution**: Fetch data for five of your most bullish SPL tokens. For each token, retrieve the current supply and use a price API to calculate the market cap.
2. **TransactionsPerSecond**: Fetch the Solana transactions-per-second (TPS) metric from the RPC over time to produce a timeseries dataset. Choose the timeframe for an optimized interval based on data availability and server load considerations.
3. **WalletBalance**: Fetch the balances of a list of 10 wallets and format the data to be displayed on a bar chart.

Implement a Redis server using another Docker container to cache the data you've fetched. Decide when to expire each dataset based on optimizing costs and possible rate limiting. Make sure to also use the cached data for requests.

### Frontend - React Application

The frontend application will fetch and display the backend data using three types of charts. You may choose any charting library, but we suggest visx or Apexcharts.js.

1. **Pie Chart**: Represents the market cap of each of your five chosen SPL tokens.
2. **Time Series Chart**: Displays the Solana transactions per second (TPS) metric.
3. **Bar Chart**: Shows the SOL balances of 10 wallets. You can choose these addresses randomly or based on your interest. For finding wallet addresses, checkout out our wallets section on [vybe.fyi](https://vybe.fyi/wallets)

Consider the frontend application's layout design, UX, and architecture. Think about the reusability, customizability, and scalability of the code.

### Testing

The application should include a basic suite of tests, at least covering the crucial functionality. Feel free to use Jest and Testing Library for this purpose.

This is required for the React app and optional for the Node API. 100% code coverage isn't expected, but you should provide at least 5 test cases. There's no need to test the charting library or other external libraries. Just ensure the components you've added are covered.

### Development and Build Environment

Your application should have a fully working development environment. Provide instructions on how to run the application in a development setting.

Set up the frontend build environment using Vite, and compile the TypeScript code into a browser-compatible JavaScript bundle. Avoid using frameworks like Next.js. Bonus points if you implement a build script to create the backend server container and include the frontend code to serve using SSR or static JS.

### Submission Guidelines

Please submit your code in a GitHub repository. It should include:

1. Source code for the backend and frontend.
2. Test files.
3. A README file containing instructions on how to set up and run your application, including installing dependencies, running tests, starting the development server, and building the project.
4. Any additional documentation you feel necessary to understand your design and development decisions.

We expect this assignment to take around 4 hours to complete. Please inform us if you find that you are spending significantly more time.

Finally, remember, we are evaluating not only if the final product works but also your approach, code quality, choice of libraries, and adherence to best practices. Good luck!
