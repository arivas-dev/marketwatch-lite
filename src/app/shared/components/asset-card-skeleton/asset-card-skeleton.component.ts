import { Component } from '@angular/core';

@Component({
  selector: '[appAssetCardSkeleton]',
  standalone: true,
  templateUrl: './asset-card-skeleton.component.html',
  host: {
    class:
      'flex flex-col rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-black/20 backdrop-blur-md pointer-events-none select-none',
    role: 'presentation',
    'aria-hidden': 'true',
  },
})
export class AssetCardSkeletonComponent {}
