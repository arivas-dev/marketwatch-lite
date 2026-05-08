import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
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

/** Alineado con Tailwind `sm:` (640px): pull-to-refresh solo en vista estrecha. */
const NARROW_MAX_PX = 639;

/** Desplazamiento vertical bruto (px) para disparar actualización al soltar. */
const PULL_REFRESH_THRESHOLD_PX = 64;

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
    class:
      'flex min-h-0 w-full flex-1 flex-col max-sm:overflow-y-auto max-sm:overscroll-y-contain max-sm:[-webkit-overflow-scrolling:touch]',
  },
})
export class DashboardComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly coinGecko = inject(CoinGeckoService);

  private ptrStartY = 0;
  private ptrTracking = false;
  private ptrMaxDy = 0;

  /** Desplazamiento amortiguado aplicado al `<main>` mientras se arrastra hacia abajo (solo móvil). */
  readonly pullDistance = signal(0);
  /** Indica si ya se alcanzó el umbral para mostrar «suelta para actualizar». */
  readonly pullReleaseReady = signal(false);

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
      this.registerPullToRefreshListeners();
    });
  }

  mainPullTransform(): string {
    const d = this.pullDistance();
    return d > 0 ? `translate3d(0, ${d}px, 0)` : '';
  }

  private registerPullToRefreshListeners(): void {
    const el = this.hostRef.nativeElement;
    el.addEventListener('touchstart', this.handlePtrStart, { passive: true });
    el.addEventListener('touchmove', this.handlePtrMove, { passive: false });
    el.addEventListener('touchend', this.handlePtrEnd, { passive: true });
    el.addEventListener('touchcancel', this.handlePtrEnd, { passive: true });
    this.destroyRef.onDestroy(() => {
      el.removeEventListener('touchstart', this.handlePtrStart);
      el.removeEventListener('touchmove', this.handlePtrMove);
      el.removeEventListener('touchend', this.handlePtrEnd);
      el.removeEventListener('touchcancel', this.handlePtrEnd);
    });
  }

  private readonly handlePtrStart = (event: TouchEvent): void => {
    if (!this.isNarrowViewport() || this.isLoading()) {
      return;
    }
    const root = this.hostRef.nativeElement;
    if (root.scrollTop > 2) {
      return;
    }
    this.ptrTracking = true;
    this.ptrStartY = event.touches[0].clientY;
    this.ptrMaxDy = 0;
    this.pullReleaseReady.set(false);
  };

  private readonly handlePtrMove = (event: TouchEvent): void => {
    if (!this.ptrTracking || !this.isNarrowViewport()) {
      return;
    }
    const root = this.hostRef.nativeElement;
    if (root.scrollTop > 2) {
      this.resetPullGesture();
      return;
    }
    const dy = event.touches[0].clientY - this.ptrStartY;
    if (dy > 0) {
      this.ptrMaxDy = Math.max(this.ptrMaxDy, dy);
      const visual = Math.min(dy * 0.45, 96);
      this.pullDistance.set(visual);
      if (dy >= PULL_REFRESH_THRESHOLD_PX) {
        this.pullReleaseReady.set(true);
      } else if (dy < PULL_REFRESH_THRESHOLD_PX * 0.45) {
        this.pullReleaseReady.set(false);
      }
      if (dy > 12) {
        event.preventDefault();
      }
    } else {
      this.pullDistance.set(0);
      this.pullReleaseReady.set(false);
    }
  };

  private readonly handlePtrEnd = (): void => {
    if (!this.ptrTracking) {
      this.pullDistance.set(0);
      this.pullReleaseReady.set(false);
      return;
    }
    this.ptrTracking = false;
    const shouldRefresh =
      this.ptrMaxDy >= PULL_REFRESH_THRESHOLD_PX && !this.isLoading();
    this.ptrMaxDy = 0;
    this.pullDistance.set(0);
    this.pullReleaseReady.set(false);
    if (shouldRefresh) {
      this.refreshMarkets();
    }
  };

  private resetPullGesture(): void {
    this.ptrTracking = false;
    this.ptrMaxDy = 0;
    this.pullDistance.set(0);
    this.pullReleaseReady.set(false);
  }

  private isNarrowViewport(): boolean {
    return (
      typeof globalThis.matchMedia !== 'undefined' &&
      globalThis.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`).matches
    );
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

  /** Vuelve a pedir los datos de la página actual (misma paginación y filtros de búsqueda). */
  refreshMarkets(): void {
    if (this.isLoading()) {
      return;
    }
    this.loadMarketsForPage(this.currentPage());
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
            'No pudimos cargar la información ahora mismo. Comprueba tu conexión a internet y vuelve a intentarlo en un momento.',
          );
          this.coins.set([]);
          this.lastPageResultCount.set(0);
          this.isLoading.set(false);
        },
      });
  }
}
