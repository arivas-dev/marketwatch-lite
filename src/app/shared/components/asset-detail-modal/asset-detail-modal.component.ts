import 'apexcharts/line';

import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ChartCoreComponent } from 'ng-apexcharts';
import type {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

import { CoinGeckoService } from '../../../core/api/coin-gecko.service';
import type { CoinDetailView } from '../../../models/coin-detail.model';
import type { Coin } from '../../../models/coin.model';

const DETAIL_CHART: ApexChart = {
  type: 'area',
  height: 220,
  toolbar: { show: false },
  zoom: { enabled: false },
  animations: { enabled: true, speed: 420 },
  fontFamily: 'inherit',
};

const DETAIL_STROKE: ApexStroke = {
  width: 2,
  curve: 'smooth',
};

const DETAIL_FILL: ApexFill = {
  type: 'gradient',
  gradient: {
    shade: 'light',
    type: 'vertical',
    shadeIntensity: 0.4,
    opacityFrom: 0.45,
    opacityTo: 0.05,
    stops: [0, 90, 100],
  },
};

const DETAIL_DATA_LABELS: ApexDataLabels = { enabled: false };
const DETAIL_GRID: ApexGrid = {
  borderColor: 'rgba(148, 163, 184, 0.2)',
  strokeDashArray: 4,
  padding: { left: 8, right: 12, top: 8, bottom: 4 },
};
const DETAIL_XAXIS: ApexXAxis = {
  labels: { show: false },
  axisBorder: { show: false },
  axisTicks: { show: false },
};
const DETAIL_YAXIS: ApexYAxis = {
  labels: {
    style: { fontSize: '10px', colors: '#94a3b8' },
    formatter: (val: number): string => {
      if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
      if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
      if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
      return val.toFixed(2);
    },
  },
};

const DETAIL_TOOLTIP: ApexTooltip = {
  theme: 'dark',
  x: { show: false },
  y: {
    formatter: (val: number): string =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 6,
      }).format(val),
  },
};

@Component({
  selector: 'app-asset-detail-modal',
  standalone: true,
  imports: [ChartCoreComponent, CurrencyPipe, DecimalPipe, DatePipe],
  templateUrl: './asset-detail-modal.component.html',
})
export class AssetDetailModalComponent {
  private readonly coinGecko = inject(CoinGeckoService);

  /** Activo seleccionado; `null` cierra el modal. */
  readonly openCoin = input<Coin | null>(null);
  readonly closed = output<void>();

  readonly detailView = signal<CoinDetailView | null>(null);
  readonly detailLoading = signal(false);
  readonly detailError = signal<string | null>(null);

  protected readonly detailChart = DETAIL_CHART;
  protected readonly detailStroke = DETAIL_STROKE;
  protected readonly detailFill = DETAIL_FILL;
  protected readonly detailDataLabels = DETAIL_DATA_LABELS;
  protected readonly detailTooltip = DETAIL_TOOLTIP;
  protected readonly detailGrid = DETAIL_GRID;
  protected readonly detailXaxis = DETAIL_XAXIS;
  protected readonly detailYaxis = DETAIL_YAXIS;

  readonly chartSeries = computed((): ApexAxisChartSeries => {
    const c = this.openCoin();
    if (!c) {
      return [];
    }
    const d = this.detailView();
    const prices =
      d && d.sparkline7d.length > 0
        ? d.sparkline7d
        : c.sparkline_in_7d.price;
    return [{ name: '7d', data: [...prices] }];
  });

  readonly chartReady = computed((): boolean => {
    const c = this.openCoin();
    return !!c && this.chartSeries()[0]?.data.length > 0;
  });

  readonly chartColors = computed((): string[] => {
    const c = this.openCoin();
    if (!c) {
      return ['#10b981'];
    }
    const up = c.price_change_percentage_24h >= 0;
    return [up ? '#10b981' : '#f43f5e'];
  });

  readonly descriptionPreview = computed((): string => {
    const d = this.detailView();
    const text = d?.descriptionPlain ?? '';
    if (text.length <= 420) {
      return text;
    }
    return `${text.slice(0, 417)}…`;
  });

  constructor() {
    effect((onCleanup) => {
      const c = this.openCoin();
      if (!c) {
        this.detailView.set(null);
        this.detailLoading.set(false);
        this.detailError.set(null);
        return;
      }
      this.detailLoading.set(true);
      this.detailError.set(null);
      this.detailView.set(null);
      const sub = this.coinGecko.getCoinDetail(c.id, c).subscribe({
        next: (v) => {
          this.detailView.set(v);
          this.detailLoading.set(false);
        },
        error: () => {
          this.detailError.set(
            'No se pudo cargar la descripción ni datos extendidos. Mostramos la información del listado.',
          );
          this.detailLoading.set(false);
        },
      });
      onCleanup(() => sub.unsubscribe());
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.openCoin()) {
      this.requestClose();
    }
  }

  protected requestClose(): void {
    this.closed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.requestClose();
    }
  }

  protected athAtlDate(value: string): Date | null {
    if (!value) {
      return null;
    }
    const t = Date.parse(value);
    return Number.isNaN(t) ? null : new Date(t);
  }
}
