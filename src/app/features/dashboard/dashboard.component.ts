import { Component, signal } from '@angular/core';

import { DEMO_COINS } from '../../data/demo-coins';
import type { Coin } from '../../models/coin.model';
import { AssetCardComponent } from '../../shared/components/asset-card/asset-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AssetCardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  readonly coins = signal<readonly Coin[]>(DEMO_COINS);
}
