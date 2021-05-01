import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @Input('nombreDeSucursales')nombreDeSucursales: string[] = [];
  @Input('ventasNetaDeSucursales')ventasNetaDeSucursales: number[] = [];
  @Input() totalVentasNetas: number = 0;
  //GRAFICOS DE CHARTS
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    },
  };
  public porcentajeVentasNeta: number[] = [];
  public pieChartLabels: Label[] = this.nombreDeSucursales;
  public pieChartData: number[] = this.ventasNetaDeSucursales;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  constructor() {}

  ngOnInit(): void {
    this.pieChartLabels = this.nombreDeSucursales;
    this.pieChartData = this.ventasNetaDeSucursales.map(data => {
      return Math.round((data/this.totalVentasNetas)*100);
    });
  }
}
