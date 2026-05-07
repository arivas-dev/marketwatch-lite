import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import type { Coin } from '../../../models/coin.model';

@Component({
  selector: '[appAssetCard]',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './asset-card.component.html',
  host: {
    class:
      'group flex flex-col rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-black/20 outline-none backdrop-blur-md transition duration-300 hover:border-white/30 hover:bg-white/[0.14] hover:shadow-xl hover:shadow-black/25 focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
  },
})
export class AssetCardComponent {
  readonly coin = input.required<Coin>();
}
