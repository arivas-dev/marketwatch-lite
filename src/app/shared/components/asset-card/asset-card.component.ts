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
      'group flex flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-md shadow-slate-900/5 outline-none backdrop-blur-md transition duration-300 hover:border-slate-300/90 hover:bg-white hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:border-white/20 dark:bg-white/10 dark:shadow-lg dark:shadow-black/20 dark:hover:border-white/30 dark:hover:bg-white/[0.14] dark:hover:shadow-xl dark:hover:shadow-black/25 dark:focus-visible:ring-white/35 dark:focus-visible:ring-offset-slate-950',
  },
})
export class AssetCardComponent {
  readonly coin = input.required<Coin>();
}
