import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Emitter } from 'src/app/emitters/emitter';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { ApexAxisChartSeries, ApexChart, ApexXAxis } from 'ng-apexcharts';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-spiderchart',
  templateUrl: './spiderchart.component.html',
  styleUrls: ['./spiderchart.component.css'],
})
export class SpiderchartComponent implements OnInit {

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  public chartOptions: ChartOptions = {
    series: [
      {
        name: 'My-series',
        data: [],
      },
    ],
    chart: {
      height: 250,
      type: 'radar',
    },
    xaxis: {
      categories: [],
    },
  };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private envEndpointService: EnvEndpointService,
    ) {}

  currentPage: number = 1;
  pageSize: number = 7;

  descId: string[] = [];

  allSkillsAndLevels: any[] = [];

  lvAndDesc: string[] = [];

  groupedByLevel: Map<
    string,
    {
      codeSkill: string;
      skillName: string;
      levelName: string;
      description: string[];
      percentage: number;
    }
  > = new Map();

  ngOnInit() {
    Emitter.authEmitter.emit(true);
    this.getHistory();
  }

  checkLogin() {
    this.http
      .get(`${this.ENV_REST_API}/user`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          AuthInterceptor.accessToken;
          Emitter.authEmitter.emit(true);
        },
        error: () => {
          this.router.navigate(['/login']);
          Emitter.authEmitter.emit(false);
        },
      });
  }

  getHistory() {
    this.http
      .get(`${this.ENV_REST_API}/getHistory`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          const descriptionsWithLevels = res.descriptionsWithLevel;

          const groupedByCodeSkillAndLevel = new Map<
            string,
            Map<
              string,
              {
                codeSkill: string;
                skillName: string;
                levelName: string;
                description: string[];
              }
            >
          >();

          descriptionsWithLevels.forEach((description: any) => {
            const codeSkill = description.uniqueSkills[0].codeskill;
            const levelName = description.level.level_name;

            if (!groupedByCodeSkillAndLevel.has(codeSkill)) {
              groupedByCodeSkillAndLevel.set(
                codeSkill,
                new Map<
                  string,
                  {
                    codeSkill: string;
                    skillName: string;
                    levelName: string;
                    description: string[];
                  }
                >()
              );
            }

            const innerMap = groupedByCodeSkillAndLevel.get(codeSkill);
            if (!innerMap?.has(levelName)) {
              innerMap?.set(levelName, {
                codeSkill: codeSkill,
                skillName: description.uniqueSkills[0].skill_name,
                levelName: levelName,
                description: [description.descriptionId],
              });
            } else {
              innerMap
                ?.get(levelName)
                ?.description.push(description.descriptionId);
            }
          });

          groupedByCodeSkillAndLevel.forEach((innerMap, codeSkill) => {
            innerMap.forEach((value, levelName) => {
              this.getPercentageSkillAndLevel(
                value.codeSkill,
                levelName,
                value.description
              );
            });
          });

          this.allSkillsAndLevels = Array.from(
            groupedByCodeSkillAndLevel.values()
          ).reduce(
            (
              acc: {
                codeSkill: string;
                skillName: string;
                levelName: string;
                description: string[];
              }[],
              innerMap
            ) => acc.concat(Array.from(innerMap.values())),
            []
          );

          this.allSkillsAndLevels.sort(
            (a, b) => (b.percentage || 0) - (a.percentage || 0)
          );

          // Populate xaxis.categories with the codeSkill and levelName combination
          this.chartOptions.xaxis = {
            categories: this.allSkillsAndLevels.map(
              (item) => `${item.codeSkill} - ${item.levelName}`
            ),
          };
        },
      });
  }

  getPercentageSkillAndLevel(
    codeSkill: string,
    levelName: string,
    descIds: string[]
  ): void {
    this.http
      .get(
        `${this.ENV_REST_API}/search?codeskill=${codeSkill}&level_name=${levelName}`,
        { withCredentials: true }
      )
      .subscribe((data: any) => {
        const selectedLevels = data[0]?.levels.filter(
          (level: any) => level.level_name == levelName
        );

        if (selectedLevels && selectedLevels.length > 0) {
          const descriptions = selectedLevels.map((level: any) => {
            const descid = level.descriptions[0]?.id || '';
            return { descid };
          });

          const percentage = parseFloat(
            (((descIds.length || 1) / descriptions.length) * 100).toFixed(2)
          );

          const skillAndLevel = this.allSkillsAndLevels.find(
            (item) =>
              item.codeSkill === codeSkill && item.levelName === levelName
          );
          if (skillAndLevel) {
            skillAndLevel.percentage = percentage;
          }
          this.allSkillsAndLevels.sort(
            (a, b) => (b.percentage || 0) - (a.percentage || 0)
          );

          this.chartOptions.series[0].data = this.allSkillsAndLevels.map(
            (item) => item.percentage
          );

          this.chartOptions.xaxis = {
            categories: this.allSkillsAndLevels.map(
              (item) => `${item.codeSkill} - ${item.levelName}`
            ),
          };
        }
      });
  }
}