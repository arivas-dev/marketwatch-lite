import 'apexcharts/line';

import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
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

import type { Coin } from '../../../models/coin.model';

const SPARKLINE_CHART: ApexChart = {
  type: 'area',
  height: 52,
  sparkline: { enabled: true },
  animations: { enabled: true, speed: 380 },
  toolbar: { show: false },
};

const SPARKLINE_STROKE: ApexStroke = {
  width: 2,
  curve: 'smooth',
};

const SPARKLINE_FILL: ApexFill = {
  type: 'gradient',
  gradient: {
    shade: 'light',
    type: 'vertical',
    shadeIntensity: 0.35,
    opacityFrom: 0.42,
    opacityTo: 0.03,
    stops: [0, 92, 100],
  },
};

const SPARKLINE_DATA_LABELS: ApexDataLabels = { enabled: false };
const SPARKLINE_TOOLTIP: ApexTooltip = { enabled: false };
const SPARKLINE_GRID: ApexGrid = {
  show: false,
  padding: { left: -2, right: -2, top: 2, bottom: 0 },
};
const SPARKLINE_XAXIS: ApexXAxis = {
  labels: { show: false },
  axisBorder: { show: false },
  axisTicks: { show: false },
};
const SPARKLINE_YAXIS: ApexYAxis = {
  labels: { show: false },
};

@Component({
  selector: '[appAssetCard]',
  standalone: true,
  imports: [ChartCoreComponent, CurrencyPipe, DecimalPipe],
  templateUrl: './asset-card.component.html',
  host: {
    class:
      'group flex flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-md shadow-slate-900/5 outline-none backdrop-blur-md transition duration-300 hover:border-slate-300/90 hover:bg-white hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 dark:border-white/20 dark:bg-white/10 dark:shadow-lg dark:shadow-black/20 dark:hover:border-white/30 dark:hover:bg-white/[0.14] dark:hover:shadow-xl dark:hover:shadow-black/25 dark:focus-visible:ring-white/35 dark:focus-visible:ring-offset-slate-950',
  },
})
export class AssetCardComponent {
  readonly coin = input.required<Coin>();

  protected readonly sparklineChart = SPARKLINE_CHART;
  protected readonly sparklineStroke = SPARKLINE_STROKE;
  protected readonly sparklineFill = SPARKLINE_FILL;
  protected readonly sparklineDataLabels = SPARKLINE_DATA_LABELS;
  protected readonly sparklineTooltip = SPARKLINE_TOOLTIP;
  protected readonly sparklineGrid = SPARKLINE_GRID;
  protected readonly sparklineXaxis = SPARKLINE_XAXIS;
  protected readonly sparklineYaxis = SPARKLINE_YAXIS;

  /** Indica si ApexCharts debe renderizarse: solo cuando hay al menos un punto en el sparkline 7d. */
  readonly hasSparkline = computed((): boolean => {
    return this.coin().sparkline_in_7d.price.length > 0;
  });

  /**
   * Serie única de tipo línea/área para el mini-gráfico 7d.
   * Copia `price` en un array nuevo para que Apex no mutue los datos del modelo al animar o actualizar.
   */
  readonly sparklineSeries = computed((): ApexAxisChartSeries => {
    const prices = this.coin().sparkline_in_7d.price;
    return [{ name: '7d', data: [...prices] }];
  });

  /** Color principal de la serie (y gradiente): verde si el 24h es ≥ 0, rojo si es negativo — alineado con los badges de la card. */
  readonly sparklineColors = computed((): string[] => {
    const up = this.coin().price_change_percentage_24h >= 0;
    return [up ? '#10b981' : '#f43f5e'];
  });
}
