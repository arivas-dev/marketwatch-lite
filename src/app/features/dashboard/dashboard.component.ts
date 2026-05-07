import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

import { DEMO_COINS } from '../../data/demo-coins';
import type { Coin } from '../../models/coin.model';
import { AssetCardSkeletonComponent } from '../../shared/components/asset-card-skeleton/asset-card-skeleton.component';
import { AssetCardComponent } from '../../shared/components/asset-card/asset-card.component';

const SIMULATED_LOAD_MS = 1500;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AssetCardComponent, AssetCardSkeletonComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly coins = signal<readonly Coin[]>([]);
  readonly skeletonPlaceholders: readonly number[] = Array.from(
    { length: DEMO_COINS.length },
    (_, index) => index,
  );

  constructor() {
    afterNextRender(() => {
      const timerId = window.setTimeout((): void => {
        this.coins.set(DEMO_COINS);
        this.isLoading.set(false);
      }, SIMULATED_LOAD_MS);
      this.destroyRef.onDestroy(() => window.clearTimeout(timerId));
    });
  }
}
