export interface CoinGeckoMarketRow {
  readonly id: string;
  readonly symbol: string;
  readonly name: string;
  readonly image: string;
  readonly current_price: number | null;
  readonly market_cap: number | null;
  readonly market_cap_rank: number | null;
  readonly total_volume: number | null;
  readonly high_24h: number | null;
  readonly low_24h: number | null;
  readonly last_updated: string | null;
  readonly price_change_percentage_24h: number | null;
  readonly price_change_percentage_1h_in_currency: number | null;
  readonly sparkline_in_7d?: { readonly price: readonly number[] } | null;
}
