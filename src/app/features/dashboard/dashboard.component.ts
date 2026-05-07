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
import { AssetDetailModalComponent } from '../../shared/components/asset-detail-modal/asset-detail-modal.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

const MARKETS_PER_PAGE = 10;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AssetCardComponent,
    AssetCardSkeletonComponent,
    AssetDetailModalComponent,
    SearchBarComponent,
  ],
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
  readonly searchQuery = signal('');
  /** Activo cuyo detalle se muestra en el modal; `null` si está cerrado. */
  readonly detailCoin = signal<Coin | null>(null);
  readonly filteredCoins = computed((): readonly Coin[] => {
    const needle = this.searchQuery().trim().toLowerCase();
    const list = this.coins();
    if (!needle) {
      return list;
    }
    return list.filter((coin) => {
      const name = coin.name.toLowerCase();
      const symbol = coin.symbol.toLowerCase();
      const id = coin.id.toLowerCase();
      return (
        name.includes(needle) ||
        symbol.includes(needle) ||
        id.includes(needle)
      );
    });
  });
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

  openAssetDetail(coin: Coin): void {
    this.detailCoin.set(coin);
  }

  closeAssetDetail(): void {
    this.detailCoin.set(null);
  }

  onDetailCardKeydown(event: KeyboardEvent, coin: Coin): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openAssetDetail(coin);
    }
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
