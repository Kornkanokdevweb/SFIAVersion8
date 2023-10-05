import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit{
  ngOnInit(): void {
    this.getSkillNames();
  }

  constructor(
    private http: HttpClient,
  ) { }
  allUniqueSkill: string[] = [];
  uniqueSkills: any[] = [];
  skillNames: string[]= [];

  getSkillNames() { 
    this.http.get('http://localhost:8080/api/getSkillName', { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          const descriptionWithLevels = res.descriptionsWithLevel;
          const allSkills = descriptionWithLevels.flatMap((description: any) => {
            return description.uniqueSkills.map((skill: any) => skill.skill_name);
          });
          const uniqueSkillsSet = new Set(allSkills);
          this.skillNames = Array.from(uniqueSkillsSet) as string[];
        },
        error: () => {
          console.log(`Error getting skill names`);
        }
      });
  }
}
