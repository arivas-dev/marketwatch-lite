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

/** Respuesta parcial de `GET /coins/{id}` (solo campos que mapeamos). */
export interface CoinGeckoCoinDetailResponse {
  readonly description?: { readonly en?: string };
  readonly links?: { readonly homepage?: readonly string[] };
  readonly market_data?: {
    readonly ath?: { readonly usd?: number | null };
    readonly ath_date?: { readonly usd?: string | null };
    readonly atl?: { readonly usd?: number | null };
    readonly atl_date?: { readonly usd?: string | null };
    readonly sparkline_7d?: { readonly price?: readonly number[] | null } | null;
  } | null;
}
