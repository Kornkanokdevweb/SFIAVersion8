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
export class HistoryComponent implements OnInit{

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {

  }

  currentPage: number = 1;
  pageSize: number = 7;

  selectedSkillData: any[] = [];

  uniqueSkill: string[] = [];

  allUniqueSkill: string[] = [];
  filteredSkillsAndLevels: any[] = [];

   get uniqueSkills(): string[] {
    return Array.from(new Set(this.allSkillsAndLevels.map(skill => skill.skillName)));
  }
  
  allSkillsAndLevels: any[] = [];
  selectedSkill: string = '';
  skillNamesLevelNames: string[]= [];
  skillNames: string[]= [];

    ngOnInit() {
      this.checkLogin();
      Emitter.authEmitter.emit(true)
      this.getHistory();
      this.onSkillSelect();
    }

    checkLogin(){
      this.http.get('http://localhost:8080/api/user', {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          AuthInterceptor.accessToken
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          this.router.navigate(['/login'])
          Emitter.authEmitter.emit(false)
        }
      });
    }

    getHistory() {
      this.http.get('http://localhost:8080/api/getHistory', {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          const descriptionsWithLevels = res.descriptionsWithLevel;
          this.allSkillsAndLevels = descriptionsWithLevels.flatMap((description: any) => {
            return description.uniqueSkills.map((skill: any) => ({
              skillName: skill.skill_name,
              levelName: description.level.level_name,
              description: description.descriptionId
            }));
          });

          const levelNames = this.allSkillsAndLevels.map((entry) => entry.levelName);
          const uniqueLevelNames = [...new Set(levelNames)];

          const levelCounts = {};
          this.filteredSkillsAndLevels = this.allSkillsAndLevels.filter((entry) => {
            if (!levelCounts[entry.levelName]){
              levelCounts[entry.levelName] = 1;
              return true;
            } else if (levelCounts[entry.levelName] < 2){
              levelCounts[entry.levelName]++;
              return true;
            }
            return false;
          })

          this.uniqueSkill = [...new Set(this.filteredSkillsAndLevels.map(entry => entry.skillName))];
          this.selectedSkillData = this.filteredSkillsAndLevels;
          console.log(this.filteredSkillsAndLevels)
        }, error: () => {
          console.log(`Error getting History`)
        }
      });
    }

    onSkillSelect() {
      if (this.selectedSkill === '' || this.selectedSkill === 'All Skill') {
        this.selectedSkillData = this.filteredSkillsAndLevels;
        this.currentPage = 1
        console.log(this.selectedSkill)
      } else {
        this.selectedSkillData = this.filteredSkillsAndLevels.filter(entry => entry.skillName === this.selectedSkill);
        this.currentPage = 1;
        console.log(this.selectedSkillData)
      }
    }
    
}    