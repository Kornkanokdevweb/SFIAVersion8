import { Component, ViewChild, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Emitter } from 'src/app/emitters/emitter'; // Update this path
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor'; // Update this path
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent,
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
export class SpiderchartComponent implements OnInit {

  public chartOptions: ChartOptions = {
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
  ) {

  }

  currentPage: number = 1;
  pageSize: number = 7;

  descId: string[] = [];

  allSkillsAndLevels: any[] = [];

  lvAndDesc: string[] = [];

  // Declare groupedByLevel at the class level
  groupedByLevel: Map<string, { codeSkill: string, skillName: string, levelName: string, description: string[], percentage: number }> = new Map();

  ngOnInit() {
    // this.checkLogin();
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

          // Use a Map to store grouped data
          const groupedByCodeSkillAndLevel = new Map<string, Map<string, { codeSkill: string, skillName: string, levelName: string, description: string[] }>>();

          descriptionsWithLevels.forEach((description: any) => {
            const codeSkill = description.uniqueSkills[0].codeskill;
            const levelName = description.level.level_name;
            console.log(codeSkill, levelName);

            // If the codeSkill is not in the outer Map, add it with an initial inner Map
            if (!groupedByCodeSkillAndLevel.has(codeSkill)) {
              groupedByCodeSkillAndLevel.set(codeSkill, new Map<string, { codeSkill: string, skillName: string, levelName: string, description: string[] }>());
            }

            const innerMap = groupedByCodeSkillAndLevel.get(codeSkill);

            // If the levelName is not in the inner Map, add it with an initial object
            if (!innerMap?.has(levelName)) {
              innerMap?.set(levelName, {
                codeSkill: codeSkill,
                skillName: description.uniqueSkills[0].skill_name,
                levelName: levelName,
                description: [description.descriptionId],
                // Start with an array containing the first descriptionId
              });
            } else {
              // If levelName is already in the inner Map, just add the descriptionId
              innerMap?.get(levelName)?.description.push(description.descriptionId);
            }
          });

          groupedByCodeSkillAndLevel.forEach((innerMap, codeSkill) => {
            innerMap.forEach((value, levelName) => {
              this.getPercentageSkillAndLevel(value.codeSkill, levelName, value.description);
            });
          });
          console.log(groupedByCodeSkillAndLevel);

          // Convert the Map values to a flat array of objects
          this.allSkillsAndLevels = Array.from(groupedByCodeSkillAndLevel.values())
            .reduce((acc: { codeSkill: string, skillName: string, levelName: string, description: string[] }[], innerMap) =>
              acc.concat(Array.from(innerMap.values())), []);
            console.log(this.allSkillsAndLevels);

          this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

          
          // Populate xaxis.categories with the codeSkill and levelName combination
          this.chartOptions.xaxis = {
            categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
          };

          console.log(this.chartOptions.xaxis);
        }
      });
  }


  getPercentageSkillAndLevel(codeSkill: string, levelName: string, descIds: string[]): void {
    console.log(`Code Skill: ${codeSkill}, Level: ${levelName}, DescIds: ${descIds.join(', ')}`);
    this.http.get(`http://localhost:8080/api/search?codeskill=${codeSkill}&level_name=${levelName}`, { withCredentials: true })
      .subscribe((data: any) => {
        const selectedLevels = data[0]?.levels.filter((level: any) => level.level_name == levelName);
        console.log(selectedLevels);

        if (selectedLevels && selectedLevels.length > 0) {
          const descriptions = selectedLevels.map((level: any) => {
            const descid = level.descriptions[0]?.id || '';
            return { descid };
          });

          const percentage = parseFloat(((descIds.length || 1) / descriptions.length * 100).toFixed(2));
          console.log(`Code Skill: ${codeSkill}, Level: ${levelName}, DescIds: ${descIds.join(', ')}, percentage: ${percentage}`);

          // Update the skillAndLevel object with the percentage property
          const skillAndLevel = this.allSkillsAndLevels.find(item => item.codeSkill === codeSkill && item.levelName === levelName);
          if (skillAndLevel) {
            skillAndLevel.percentage = percentage;
          }
          this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

          this.chartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage);

          this.chartOptions.xaxis = {
            categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
          };

          console.log(this.chartOptions.xaxis);

        }
       
      });
  }

}