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

  isDropdownVisible = false;

  selectedSkill: string | null = null;

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
    private envEndpointService: EnvEndpointService
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
      this.http.get(`${this.ENV_REST_API}/search?codeskill=${codeSkill}&level_name=${levelName}`, { withCredentials: true })
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
    console.log(this.spiderChartOptions.series[0].data.length);
    this.spiderChartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
    };
  }

  updateChartData() {
    this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

    this.chartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage || 0);

    console.log(this.chartOptions.series[0].data.length)

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

  selectSkill(skillName: string) {
    if (skillName === '') {
      this.getHistory();
    }
  
    this.selectedSkill = skillName;
    this.filterSkills();
    this.isDropdownVisible = false;
    this.currentPage = 1;

    const filteredSkills = this.allSkillsAndLevels.filter(skill => skill.skillName === skillName);
  
    console.log('Selected Skill:', skillName);
    console.log('Filtered Skills:', filteredSkills);

    const percentages: number[] = [];
  
    filteredSkills.forEach(skill => {
      console.log('Code Skill:', skill.codeSkill, 'Level Name:', skill.levelName, 'Percentage:', skill.percentage);
  
      const validPercentage: number = skill.percentage ?? 0;
  
      percentages.push(validPercentage);
    });
  
    this.spiderChartOptions.series[0].data = percentages;
    this.spiderChartOptions.xaxis = {
      categories: filteredSkills.map(skill => `${skill.codeSkill} - ${skill.levelName}`)
    };

    console.log(this.spiderChartOptions.series[0].data.length);

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
          console.log(res);
          const descriptionsWithLevels = res.descriptionsWithLevel;
  
          // Set to store unique skill_name
          const uniqueSkills = new Set<string>();
  
          descriptionsWithLevels.forEach((description: any) => {
            const skillName = description.uniqueSkills[0].skill_name;
            const codeSkill = description.uniqueSkills[0].codeskill;
            const levelName = description.level.level_name;
            console.log(skillName, codeSkill, levelName);
  
            // Add skill_name to the set
            uniqueSkills.add(skillName);
          });
  
          // Now, uniqueSkills contains the unique skill_name values
          console.log(uniqueSkills);
  
          // Convert the Set to an array of objects with property skillName
          this.dropdownSkillUnique = Array.from(uniqueSkills).map(skillName => ({ skillName }));
          console.log(this.dropdownSkillUnique);
        },
      });
  }

}