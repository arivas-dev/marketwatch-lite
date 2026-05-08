import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import type { Coin } from '../../models/coin.model';
import type { CoinDetailView } from '../../models/coin-detail.model';
import type { CoinGeckoCoinDetailResponse, CoinGeckoMarketRow } from './coin-gecko.types';

const COINGECKO_API_V3 = 'https://api.coingecko.com/api/v3';

@Injectable({ providedIn: 'root' })
export class CoinGeckoService {
  private readonly http = inject(HttpClient);

  getTopMarkets(perPage: number, page: number): Observable<readonly Coin[]> {
    const safePage = Math.max(1, Math.floor(page));

    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('order', 'market_cap_desc')
      .set('per_page', String(perPage))
      .set('page', String(safePage))
      .set('sparkline', 'true')
      .set('price_change_percentage', '1h');

    return this.http
      .get<readonly CoinGeckoMarketRow[]>(`${COINGECKO_API_V3}/coins/markets`, {
        params,
      })
      .pipe(map((rows) => rows.map(mapMarketRowToCoin)));
  }

  getCoinDetail(coinId: string, summary: Coin): Observable<CoinDetailView> {
    const params = new HttpParams()
      .set('localization', 'false')
      .set('tickers', 'false')
      .set('market_data', 'true')
      .set('community_data', 'false')
      .set('developer_data', 'false')
      .set('sparkline', 'true');

    const encodedId = encodeURIComponent(coinId);

    return this.http
      .get<CoinGeckoCoinDetailResponse>(
        `${COINGECKO_API_V3}/coins/${encodedId}`,
        { params },
      )
      .pipe(map((body) => mapCoinDetailResponse(body, summary)));
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

function htmlDescriptionToPlain(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstHomepageUrl(links: CoinGeckoCoinDetailResponse['links']): string | null {
  const raw = links?.homepage?.find((h) => typeof h === 'string' && h.trim().length > 0);
  if (!raw) {
    return null;
  }
  try {
    const u = new URL(raw.trim());
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

function mapCoinDetailResponse(
  body: CoinGeckoCoinDetailResponse,
  summary: Coin,
): CoinDetailView {
  const md = body.market_data;
  const fromApi = md?.sparkline_7d?.price;
  const sparkline7d: readonly number[] =
    fromApi && fromApi.length > 0 ? [...fromApi] : [...summary.sparkline_in_7d.price];

  const descRaw = body.description?.en?.trim() ?? '';
  const descriptionPlain = descRaw ? htmlDescriptionToPlain(descRaw) : '';

  return {
    summary,
    descriptionPlain,
    homepageUrl: firstHomepageUrl(body.links),
    athUsd: md?.ath?.usd ?? 0,
    athDateIso: md?.ath_date?.usd ?? '',
    atlUsd: md?.atl?.usd ?? 0,
    atlDateIso: md?.atl_date?.usd ?? '',
    sparkline7d,
  };
}
