import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CoinGeckoService } from '../../core/api/coin-gecko.service';
import type { Coin } from '../../models/coin.model';
import { AssetCardSkeletonComponent } from '../../shared/components/asset-card-skeleton/asset-card-skeleton.component';
import { AssetCardComponent } from '../../shared/components/asset-card/asset-card.component';

const MARKETS_PER_PAGE = 10;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AssetCardComponent, AssetCardSkeletonComponent],
  templateUrl: './dashboard.component.html',
  host: {
    class: 'flex min-h-0 w-full flex-1 flex-col',
  },
})
export class DashboardComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly coinGecko = inject(CoinGeckoService);

  readonly isLoading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly coins = signal<readonly Coin[]>([]);
  readonly currentPage = signal(1);
  /** Longitud de la última respuesta; si es menor que `MARKETS_PER_PAGE`, no hay página siguiente. */
  private readonly lastPageResultCount = signal(0);

  readonly hasNextPage = computed(
    () => this.lastPageResultCount() === MARKETS_PER_PAGE,
  );
  readonly canGoPrevious = computed(() => this.currentPage() > 1);

  readonly skeletonPlaceholders: readonly number[] = Array.from(
    { length: MARKETS_PER_PAGE },
    (_, index) => index,
  );

  constructor() {
    afterNextRender(() => {
      this.loadMarketsForPage(1);
    });
  }

  goToPreviousPage(): void {
    if (!this.canGoPrevious() || this.isLoading()) {
      return;
    }
    this.loadMarketsForPage(this.currentPage() - 1);
  }

  goToNextPage(): void {
    if (!this.hasNextPage() || this.isLoading()) {
      return;
    }
    this.loadMarketsForPage(this.currentPage() + 1);
  }

  private loadMarketsForPage(page: number): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.coinGecko
      .getTopMarkets(MARKETS_PER_PAGE, page)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.currentPage.set(page);
          this.coins.set(list);
          this.lastPageResultCount.set(list.length);
          this.loadError.set(null);
          this.isLoading.set(false);
        },
        error: () => {
          this.loadError.set(
            'No se pudo cargar el mercado. Revisa la API key en `.env` (VITE_COINGECKO_DEMO_API_KEY) y tu conexión.',
          );
          this.coins.set([]);
          this.lastPageResultCount.set(0);
          this.isLoading.set(false);
        },
      });
  }
}
