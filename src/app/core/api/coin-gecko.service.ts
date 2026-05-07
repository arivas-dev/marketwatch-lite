import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { Coin } from '../../models/coin.model';
import type { CoinGeckoMarketRow } from './coin-gecko.types';

const COINGECKO_API_V3 = 'https://api.coingecko.com/api/v3';

@Injectable({ providedIn: 'root' })
export class CoinGeckoService {
  private readonly http = inject(HttpClient);

  getTopMarkets(perPage: number): Observable<readonly Coin[]> {
    const key = environment.coingeckoDemoApiKey.trim();
    const headers = key
      ? new HttpHeaders({ 'x-cg-demo-api-key': key })
      : new HttpHeaders();

    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('order', 'market_cap_desc')
      .set('per_page', String(perPage))
      .set('page', '1')
      .set('sparkline', 'true')
      .set('price_change_percentage', '1h');

    return this.http
      .get<readonly CoinGeckoMarketRow[]>(`${COINGECKO_API_V3}/coins/markets`, {
        headers,
        params,
      })
      .pipe(map((rows) => rows.map(mapMarketRowToCoin)));
  }
}

function mapMarketRowToCoin(row: CoinGeckoMarketRow): Coin {
  const prices = row.sparkline_in_7d?.price;
  return {
    id: row.id,
    symbol: row.symbol,
    name: row.name,
    image: row.image,
    current_price: row.current_price ?? 0,
    market_cap: row.market_cap ?? 0,
    market_cap_rank: row.market_cap_rank ?? 0,
    price_change_percentage_24h: row.price_change_percentage_24h ?? 0,
    price_change_percentage_1h_in_currency:
      row.price_change_percentage_1h_in_currency ?? 0,
    total_volume: row.total_volume ?? 0,
    high_24h: row.high_24h ?? 0,
    low_24h: row.low_24h ?? 0,
    last_updated: row.last_updated ?? '',
    sparkline_in_7d: {
      price: prices ? [...prices] : [],
    },
  };
}
