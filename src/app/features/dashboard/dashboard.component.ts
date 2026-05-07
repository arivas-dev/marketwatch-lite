import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, signal } from '@angular/core';

import { DEMO_COINS } from '../../data/demo-coins';
import type { Coin } from '../../models/coin.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  readonly coins = signal<readonly Coin[]>(DEMO_COINS);
}
