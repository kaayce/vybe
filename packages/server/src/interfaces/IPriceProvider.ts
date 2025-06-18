export interface IPriceProvider {
  /**
   * Fetches prices for a given list of token symbols.
   * @param symbols An array of token symbols (e.g., ['SOL', 'ETH']).
   * @returns A promise that resolves to a record where keys are symbols and values are their prices.
   */
  fetchPrices(symbols: string[]): Promise<Record<string, number>>
}
