import { Component, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

@Component({
  selector: 'app-datachart',
  templateUrl: './datachart.component.html',
  styleUrls: ['./datachart.component.css'],
})
export class DatachartComponent {
  @ViewChild('chart')
  chart!: ChartComponent;

  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function (chart, w, e) {},
      },
    },
    colors: [
      '#008FFB',
      '#00E396',
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#546E7A',
      '#26a69a',
      '#D10CE8',
    ],
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2'],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      categories: [
        'Apples',
        'Oranges',
        'Strawberries',
        'Pineapples',
        'Mangoes',
        'Bananas',
        'Blackberries',
        'Pears',
        'Watermelons melons',
        'Cherries',
        'Pomegranates',
        'Tangerines',
        'Papayas',
      ],
    },
    yaxis: {
      title: {
        text: 'Servings',
      },
    },
  };

  constructor() {
    this.chartOptions.series = [
      {
        name: 'distibuted',
        data: [21, 22, 25, 28, 16, 21, 13, 30, 21, 45, 10, 50, 55],
      },
    ];
  }
}