import { Component } from '@angular/core';

@Component({
  selector: '[appAssetCardSkeleton]',
  standalone: true,
  templateUrl: './asset-card-skeleton.component.html',
  host: {
    class:
      'flex flex-col rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-md shadow-slate-900/5 backdrop-blur-md pointer-events-none select-none dark:border-white/20 dark:bg-white/10 dark:shadow-lg dark:shadow-black/20',
    role: 'presentation',
    'aria-hidden': 'true',
  },
})
export class AssetCardSkeletonComponent {}
