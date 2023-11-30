import { Component, ViewChild } from "@angular/core";

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-spiderchart',
  templateUrl: './spiderchart.component.html',
  styleUrls: ['./spiderchart.component.css']
})
export class SpiderchartComponent {
  @ViewChild("chart")
  chart!: ChartComponent;

  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      height: 250,
      type: "radar"
    },
    xaxis: {
      categories: ["January", "February", "March", "April", "May", "June"]
    }
  };

  constructor() {
    this.chartOptions.series = [
      {
        name: "Series 1",
        data: [80, 50, 30, 40, 20, 20]
      }
    ];
  }
}