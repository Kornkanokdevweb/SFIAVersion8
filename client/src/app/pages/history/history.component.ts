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

  allUniqueSkill: string[] = [];

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

          const uniqueSkillsAndLevelsSet = new Set(this.allSkillsAndLevels.map((value) => JSON.stringify(value)));

          this.allSkillsAndLevels = Array.from(uniqueSkillsAndLevelsSet).map((value) => JSON.parse(value));
          console.log(this.allSkillsAndLevels)
        }, error: () => {
          console.log(`Error getting History`)
        }
      });
    }

    onSkillSelect() {
      console.log('Selected Skill:', this.selectedSkill);
    }
}    