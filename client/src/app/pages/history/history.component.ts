import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexXAxis
} from "ng-apexcharts";

type SkillAndLevel = {
  codeSkill: string;
  skillName: string;
  levelName: string;
  description: string[];
  percentage?: number; // Add the percentage property here
};


export type spiderChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

export type dataChartOptions = {
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
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class HistoryComponent implements OnInit {
  
  public chartOptions: dataChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        }
      }
    },
    colors: [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#546E7A",
      "#26a69a",
      "#D10CE8"
    ],
    plotOptions: {
      bar: {
        columnWidth: "50%",
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"]
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: [
       
      ],
    },
    yaxis: {
      title: {
        text: "Servings"
      }
    },

  };

  public spiderChartOptions: spiderChartOptions = {
    series: [
      {
        name: "My-series",
        data: []
      }
    ],
    chart: {
      height: 250,
      type: "radar"
    },
    xaxis: {
      categories: []
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.chartOptions.series = [
      {
        name: "Percentage",
        data: []
      }
    ];
  }

  currentPage: number = 1;
  pageSize: number = 7;

  descId: string[] = [];

  allSkillsAndLevels: SkillAndLevel[] = [];

  lvAndDesc: string[] = [];

  // Declare groupedByLevel at the class level
  groupedByLevel: Map<string, { codeSkill: string, skillName: string, levelName: string, description: string[], percentage: number }> = new Map();

  ngOnInit() {
    this.checkLogin();
    Emitter.authEmitter.emit(true);
    this.getHistory();
  }

  checkLogin() {
    this.http.get('http://localhost:8080/api/user', { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          AuthInterceptor.accessToken;
          Emitter.authEmitter.emit(true);
        },
        error: () => {
          this.router.navigate(['/login']);
          Emitter.authEmitter.emit(false);
        }
      });
  }

  getHistory() {
    this.http.get('http://localhost:8080/api/getHistory', { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          const descriptionsWithLevels = res.descriptionsWithLevel;
  
          const groupedByCodeSkillAndLevel = new Map<string, Map<string, SkillAndLevel>>();
  
          descriptionsWithLevels.forEach((description: any) => {
            const codeSkill = description.uniqueSkills[0].codeskill;
            const levelName = description.level.level_name;
            console.log(codeSkill, levelName);
  
            if (!groupedByCodeSkillAndLevel.has(codeSkill)) {
              groupedByCodeSkillAndLevel.set(codeSkill, new Map<string, SkillAndLevel>());
            }
  
            const innerMap = groupedByCodeSkillAndLevel.get(codeSkill) || new Map<string, SkillAndLevel>();
  
            if (!innerMap.has(levelName)) {
              innerMap.set(levelName, {
                codeSkill: codeSkill,
                skillName: description.uniqueSkills[0].skill_name,
                levelName: levelName,
                description: [description.descriptionId],
                percentage: 0, // Initialize percentage here
              });
            } else {
              innerMap.get(levelName)?.description.push(description.descriptionId);
            }
          });
  
          const promises: Promise<void>[] = [];
  
          groupedByCodeSkillAndLevel.forEach((innerMap, codeSkill) => {
            innerMap.forEach((value) => {
              const promise = this.getPercentageSkillAndLevel(value.codeSkill, value.levelName, value.description)
                .then((percentage) => {
                  value.percentage = percentage;
                });
              promises.push(promise);
            });
          });
  
          Promise.all(promises).then(() => {
            this.allSkillsAndLevels = Array.from(groupedByCodeSkillAndLevel.values())
              .reduce((acc: SkillAndLevel[], innerMap) => acc.concat(Array.from(innerMap.values())), []);
  
            console.log(this.allSkillsAndLevels);
  
            this.updateSpiderChartData();
            this.updateChartData()
     
  
            console.log(this.spiderChartOptions.xaxis);
          });
        },
      });
  }
  
  getPercentageSkillAndLevel(codeSkill: string, levelName: string, descIds: string[]): Promise<number> {
    return new Promise((resolve) => {
      console.log(`Code Skill: ${codeSkill}, Level: ${levelName}, DescIds: ${descIds.join(', ')}`);
      this.http.get(`http://localhost:8080/api/search?codeskill=${codeSkill}&level_name=${levelName}`, { withCredentials: true })
        .subscribe((data: any) => {
          const selectedLevels = data[0]?.levels.filter((level: any) => level.level_name === levelName);
          console.log(selectedLevels);
  
          if (selectedLevels && selectedLevels.length > 0) {
            const descriptions = selectedLevels.map((level: any) => {
              const descid = level.descriptions[0]?.id || '';
              return { descid };
            });
  
            const percentage = parseFloat(((descIds.length || 1) / descriptions.length * 100).toFixed(2));
            console.log(`Code Skill: ${codeSkill}, Level: ${levelName}, percentage: ${percentage}`);
  
            // Use type assertion to ensure TypeScript recognizes the type
            const skillAndLevel = this.allSkillsAndLevels.find(item => item.codeSkill === codeSkill && item.levelName === levelName) as SkillAndLevel;
  
            // Update the skillAndLevel object with the percentage property
            if (skillAndLevel) {
              skillAndLevel.percentage = percentage;
            }
  
            this.updateSpiderChartData();
            this.updateChartData()
  
            console.log(this.spiderChartOptions.xaxis);
            resolve(percentage);
          } else {
            resolve(0); // Handle the case when selectedLevels is empty
          }
        });
    });
  }
  
  
  updateSpiderChartData() {
    this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  
    this.spiderChartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage || 0);
  
    this.spiderChartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
    };
  }

  updateChartData() {
    this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  
    this.chartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage || 0);
  
    console.log(this.chartOptions.series[0].data)

    this.chartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
    };

    console.log(this.chartOptions.xaxis)
  }

  

  clickToDetail(codeSkill: string, levelName: string) {
    console.log('Code Skill', codeSkill, 'Level Name', levelName);
    if (codeSkill && levelName) {
      // Open a new window
      const url = this.router.createUrlTree([`/detail-standard/${codeSkill}`]);
      window.open(`${url}`, '_blank');
      console.log(levelName)
    }
  }

}

