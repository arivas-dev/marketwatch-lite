import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import type { Coin } from '../../../models/coin.model';

@Component({
  selector: 'app-asset-card',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './asset-card.component.html',
})
export class AssetCardComponent {
  readonly coin = input.required<Coin>();
}
