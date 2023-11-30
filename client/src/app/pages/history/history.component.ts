import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

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
          const descriptionsWithLevels = res.descriptionsWithLevel;

          descriptionsWithLevels.forEach((description: any) => {
            const levelName = description.level.level_name;

            if (!this.groupedByLevel.has(levelName)) {
              this.groupedByLevel.set(levelName, {
                codeSkill: description.uniqueSkills[0].codeskill,
                skillName: description.uniqueSkills[0].skill_name,
                levelName: levelName,
                description: [description.descriptionId],
                percentage: 0,
              });
            } else {
              this.groupedByLevel.get(levelName)?.description.push(description.descriptionId);
            }
          });

          this.groupedByLevel.forEach((value, key) => {
            this.getPercentageSkillAndLevel(value.codeSkill, value.levelName);
          });

          this.groupedByLevel.forEach((value, key) => {
            const descriptionArray = value.description;
            console.log(`Level: ${key}, Descriptions: ${descriptionArray.join(', ')}`);
            return descriptionArray;
          });

          this.allSkillsAndLevels = Array.from(this.groupedByLevel.values());
          
          


          console.log(this.allSkillsAndLevels);
        },
        error: () => {
          console.log(`Error getting History`);
        },
      });
  }

  clickToDetail(codeSkill: string) {
    console.log('Code Skill', codeSkill);
    if (codeSkill) {
      window.open(`/detail-standard/${codeSkill}`, '_blank');
    }
  }

  getPercentageSkillAndLevel(codeSkill: string, levelName: string) {
    this.http.get(`http://localhost:8080/api/search?codeskill=${codeSkill}&level_name=${levelName}`, { withCredentials: true })
      .subscribe((data: any) => {
        const selectedLevels = data[0]?.levels.filter((level: any) => level.level_name == levelName);
  
        if (selectedLevels && selectedLevels.length > 0) {
          const descriptions = selectedLevels.map((level: any) => {
            const descid = level.descriptions[0]?.id || '';
            return { descid };
          });
  
          const percentage = parseFloat(((this.groupedByLevel.get(levelName)?.description.length ?? 1) / descriptions.length * 100).toFixed(2));
          this.groupedByLevel.get(levelName)!.percentage = percentage;
          console.log(`desic ทั้งของเลเวล ${levelName}:`, descriptions);
          console.log(`Percentage for Level ${levelName}: ${percentage}%`);
          this.allSkillsAndLevels.sort((a, b) => b.percentage - a.percentage);
        }
      });
  }
  
}