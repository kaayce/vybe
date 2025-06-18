# Challenge Improvements

## BE

### Code Structure

- `fetchPrices` is tightly coupled to `TokenService`. Applying Strategy Pattern, we can improve this by using an interface ie `IPriceProvider` and passing it in the constructor. This way, we can easily swap out implementations of `CoinPriceProvider`

### Caching

- Use Hashes instead of strings for token/ - easier to update/retrieve as you dont have to deserialize data every time
  - Hashes applied on `token` and `wallet` routes
- For time series data `metrics`, we use Sorted Sets with timestamp as score and tps data as value

## FE

- Use `useSuspenseQuery` instead of `useQuery` and `Suspense` for better data flow (data is guaranteed to be available) and less boilerplate
- Use `useMemo` to memoize chart data to avoid unnecessary re-renders
- Add localized `ErrorBoundaries` to handle errors in components
