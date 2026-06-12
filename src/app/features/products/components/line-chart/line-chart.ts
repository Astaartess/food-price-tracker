import { AfterViewInit, Component, ElementRef, input, viewChild, computed } from '@angular/core';
import Chart, { ChartConfiguration, ChartData } from 'chart.js/auto';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { LineChartData } from '../../types/line-chart-data';
import { CurrencyCode } from '../../../../types/currency-code';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart implements AfterViewInit {
  public data = input.required<LineChartData>();
  public currency = input.required<CurrencyCode>();

  private canvasRef = viewChild<ElementRef>('canvas');
  private chart: Chart | undefined;

  private libraryChartData = computed((): ChartData => {
    const source = this.data();
    return {
      labels: source.xLabels,
      datasets: source.datasets.map((dataset) => ({
        ...dataset,
        spanGaps: true,
        tension: 0.3,
      })),
    };
  });

  private onDataChange = toObservable(this.libraryChartData)
    .pipe(takeUntilDestroyed())
    .subscribe(() => {
      if (this.chart) {
        this.chart.destroy();
        this.chart = undefined;
        const canvas = this.canvasRef()?.nativeElement;
        if (canvas) {
          this.createChart(canvas);
        }
      }
    });

  public ngAfterViewInit(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (canvas) {
      this.createChart(canvas);
    }
  }

  private createChart(canvasElement: HTMLCanvasElement): void {
    const config: ChartConfiguration = {
      type: 'line',
      data: this.libraryChartData(),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            align: 'end',
          },
          title: {
            display: false,
          },
        },
        scales: this.data().scales,
      },
    };
    this.chart = new Chart(canvasElement, config);
  }
}
