import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexXAxis,
  ApexTitleSubtitle,
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
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class HistoryComponent implements OnInit {

  isDropdownVisible = false;

  selectedSkill: string | null = null;

  skillDetails: any;

  filteredSkillsAndLevels: SkillAndLevel[] = [];

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  public chartOptions: dataChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {
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
        text: "Percentage",
      }
    },
    title: {
      text: "Job-Level",
      offsetY: 336,
      align: "center",
      style: {
        color: "#444",
        fontSize: "12px"
      }
    }
  };

  public spiderChartOptions: spiderChartOptions = {
    series: [
      {
        name: "Percentage",
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
    private envEndpointService: EnvEndpointService,
  ) {
    this.chartOptions.series = [
      {
        name: "Percentage",
        data: []
      }
    ];
  }
  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  currentPage: number = 1;
  pageSize: number = 7;

  descId: string[] = [];

  allSkillsAndLevels: SkillAndLevel[] = [];

  dropdownSkillUnique: any[] = [];

  labelOfDataChart: string[] = [];

  // Declare groupedByLevel at the class level
  groupedByLevel: Map<string, { codeSkill: string, skillName: string, levelName: string, description: string[], percentage: number }> = new Map();

  ngOnInit() {
    this.checkLogin();
    Emitter.authEmitter.emit(true);
    this.getHistory();
    this.filterSkills();
    this.dropDownSkills();
  }

  checkLogin() {
    this.http.get(`${this.ENV_REST_API}/user`, { withCredentials: true })
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
    this.http.get(`${this.ENV_REST_API}/getHistory`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          console.log(res)
          const descriptionsWithLevels = res.descriptionsWithLevel;

          const groupedByCodeSkillAndLevel = new Map<string, Map<string, SkillAndLevel>>();

          descriptionsWithLevels.forEach((description: any) => {
            const codeSkill = description.uniqueSkills[0].codeskill;
            const levelName = description.level.level_name;
            this.fetchSkillDetails(codeSkill);
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
            this.updateSpiderChartData();
            this.updateChartData()

            const dataOfLabel = Array.from(new Set(this.allSkillsAndLevels.map(({ codeSkill, skillName }) => `${codeSkill}-${skillName}`)))
              .map(entry => {
                const [codeSkill, skillName] = entry.split('-');
                return { codeSkill, skillName };
              });
            
              this.labelOfDataChart = dataOfLabel.map(skill => `${skill.codeSkill} - ${skill.skillName}`);
            });
        },
      });
  }

  getPercentageSkillAndLevel(codeSkill: string, levelName: string, descIds: string[]): Promise<number> {
    return new Promise((resolve) => {
      this.http.get(`${this.ENV_REST_API}/search?codeskill=${codeSkill}&level_name=${levelName}`, { withCredentials: true })
        .subscribe((data: any) => {
          const selectedLevels = data[0]?.levels.filter((level: any) => level.level_name === levelName);

          if (selectedLevels && selectedLevels.length > 0) {
            const descriptions = selectedLevels.map((level: any) => {
              const descid = level.descriptions[0]?.id || '';
              return { descid };
            });

            const percentage = parseFloat(((descIds.length || 1) / descriptions.length * 100).toFixed(2));

            const skillAndLevel = this.allSkillsAndLevels.find(item => item.codeSkill === codeSkill && item.levelName === levelName) as SkillAndLevel;

            if (skillAndLevel) {
              skillAndLevel.percentage = percentage;
            }

            resolve(percentage);
          } else {
            resolve(0);
          }
        });
    });
  }

  updateSpiderChartData() {
    this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

    this.spiderChartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage || 0);

    if (this.spiderChartOptions.series[0].data.length < 6) {
      const remainingLength = 6 - this.spiderChartOptions.series[0].data.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.series[0].data.push('0' as any);
      }
    }
    this.spiderChartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
    };

    if(this.spiderChartOptions.xaxis.categories.length < 3){
      const remainingLength = 6 - this.spiderChartOptions.xaxis.categories.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.xaxis.categories.push('' as any);
      }
    }
  }

  updateChartData() {
    this.allSkillsAndLevels.sort((a, b) => {
      const percentageDiff = (b.percentage || 0) - (a.percentage || 0);
      // If percentages are equal, sort alphabetically by codeSkill and levelName
      if (percentageDiff === 0) {
        const codeSkillComparison = a.codeSkill.localeCompare(b.codeSkill);
        if (codeSkillComparison === 0) {
          return a.levelName.localeCompare(b.levelName);
        }
        return codeSkillComparison;
      }
      return percentageDiff;
    });

    this.chartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage || 0);

    this.chartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
    };
  }

  clickToDetail(codeSkill: string, levelName: string) {
    if (codeSkill && levelName) {
      const url = this.router.createUrlTree([`/detail-standard/${codeSkill}`]);
      window.open(`${url}`, '_blank');
    }
  }

  selectSkill(skillName: string) {
    if (skillName === '') {
      this.getHistory();
    }

    const uniqueSkills = new Set();
    this.allSkillsAndLevels.forEach(skill => {
      const key = `${skill.skillName}-${skill.codeSkill}`;
      uniqueSkills.add(key);
    });
    const uniqueSkillsArray = Array.from(uniqueSkills);
    console.log(uniqueSkillsArray);
    
    this.selectedSkill = skillName;
    this.filterSkills();
    this.isDropdownVisible = false;
    this.currentPage = 1;   

    const filteredSkills = this.allSkillsAndLevels.filter(skill => skill.skillName === skillName);
    console.log(filteredSkills);
    const skillNamesAndCodes = filteredSkills.map(skill => ({
      skillName: skill.skillName,
      codeSkill: skill.codeSkill
    }));
    console.log(skillNamesAndCodes)
    this.labelOfDataChart = [`${skillNamesAndCodes[0].skillName} ${skillNamesAndCodes[0].codeSkill}`];
    console.log(this.labelOfDataChart);
    const percentages: number[] = [];
  
    filteredSkills.forEach(skill => {  
      const validPercentage: number = skill.percentage ?? 0;
      percentages.push(validPercentage);
    });
  
    this.spiderChartOptions.series[0].data = percentages;
    if (this.spiderChartOptions.series[0].data.length < 6) {
      const remainingLength = 6 - this.spiderChartOptions.series[0].data.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.series[0].data.push('0' as any);
      }
    }

    this.spiderChartOptions.xaxis = {
      categories: filteredSkills.map(skill => `${skill.codeSkill} - ${skill.levelName}`)
    };
    if(this.spiderChartOptions.xaxis.categories.length < 3){
      const remainingLength = 6 - this.spiderChartOptions.xaxis.categories.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.xaxis.categories.push('' as any);
      }
    }

    this.chartOptions.series[0].data = percentages;
    this.chartOptions.xaxis = {
      categories: filteredSkills.map(skill => `${skill.codeSkill} - ${skill.levelName}`)
    };
  }

  filterSkills() {
    if (!this.selectedSkill) {
      this.filteredSkillsAndLevels = this.allSkillsAndLevels;
    } else {
      this.filteredSkillsAndLevels = this.allSkillsAndLevels.filter(skillAndLevel =>
        skillAndLevel.skillName === this.selectedSkill
      );
    }
  }

  dropDownSkills() {
    this.http.get(`${this.ENV_REST_API}/getHistory`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          const descriptionsWithLevels = res.descriptionsWithLevel;
  
          const uniqueSkills = new Set<string>();
  
          descriptionsWithLevels.forEach((description: any) => {
            const skillName = description.uniqueSkills[0].skill_name;
            const codeSkill = description.uniqueSkills[0].codeskill;
            const levelName = description.level.level_name;
            uniqueSkills.add(skillName);
          });
          this.dropdownSkillUnique = Array.from(uniqueSkills).map(skillName => ({ skillName }));
        },
      });
  }

  fetchSkillDetails(codeSkill: string) {
    this.http
      .get(`${this.ENV_REST_API}/search?codeskill=${codeSkill}`)
      .subscribe(
        (details: any) => {
          const allDescids = (details[0].levels.length);
        }
      )}
}