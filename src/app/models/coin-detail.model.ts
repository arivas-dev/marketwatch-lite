import type { Coin } from './coin.model';

/** Datos extra del endpoint `/coins/{id}` combinados con el resumen del listado. */
export interface CoinDetailView {
  readonly summary: Coin;
  readonly descriptionPlain: string;
  readonly homepageUrl: string | null;
  readonly athUsd: number;
  readonly athDateIso: string;
  readonly atlUsd: number;
  readonly atlDateIso: string;
  readonly sparkline7d: readonly number[];
}
