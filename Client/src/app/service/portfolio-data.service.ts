import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  private API_URL = 'http://localhost:8080/api';
  private itemDeletedSubject = new Subject<void>();
  private newItemAddedSubject = new Subject<void>();
  private selectedSkillSubject = new Subject<string>();
  private nameSkill:string = "";
  private filteredSkills: any[] = [];

  constructor(private http: HttpClient) { }

  setFilteredSkills(filteredSkills: any[]): void {
    this.filteredSkills = filteredSkills;
  }

  setNameSkills(nameSkill: string): void {
    this.nameSkill = nameSkill;
  }

  getFilteredSkills(): any[] {
    return this.filteredSkills;
  }
  getNameSkills(): string {
    return this.nameSkill;
  }

  // GET
  getEducationData(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getEducation`, {
      withCredentials: true,
    });
  }
  getExperienceData(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getExperience`, {
      withCredentials: true,
    });
  }
  getLinkData(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getDatacollection`, {
      withCredentials: true,
    });
  }
  getAllSkillNames(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/getHistory`, {
      withCredentials: true,
    });
  }

  notifySkillSelected(skill: string): void {
    this.selectedSkillSubject.next(skill);
  }

  getSelectedSkillSubject(): Observable<string> {
    return this.selectedSkillSubject.asObservable();
  }

  // POST
  saveEducation(formData: any): Observable<any> {
    return this.http
      .post(`${this.API_URL}/createEducation`, formData, {
        withCredentials: true,
      })
      .pipe(tap(() => this.newItemAddedSubject.next()));
  }
  saveExperience(formData: any): Observable<any> {
    return this.http
      .post(`${this.API_URL}/createExperience`, formData, {
        withCredentials: true,
      })
      .pipe(tap(() => this.newItemAddedSubject.next()));
  }

  getNewItemAddedSubject(): Observable<void> {
    return this.newItemAddedSubject.asObservable();
  }

  // PUT
  updateEducation(formData: any): Observable<any> {
    const educationId = formData.education_id;
    return this.http.put(
      `${this.API_URL}/updateEducation?education_id=${educationId}`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
  updateExperience(formData: any): Observable<any> {
    const experienceId = formData.exp_id;
    return this.http.put(
      `${this.API_URL}/updateExperience?exp_id=${experienceId}`,
      formData,
      {
        withCredentials: true,
      }
    );
  }


  // DELETE
  deleteEducation(educationId: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/deleteEducation?education_id=${educationId}`, {
        withCredentials: true,
      })
      .pipe(
        // Notify subscribers when an item is deleted
        tap(() => this.itemDeletedSubject.next())
      );
  }
  deleteExperience(experienceId: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/deleteExperience?exp_id=${experienceId}`, {
        withCredentials: true,
      })
      .pipe(
        // Notify subscribers when an item is deleted
        tap(() => this.itemDeletedSubject.next())
      );
  }


  getItemDeletedSubject(): Observable<void> {
    return this.itemDeletedSubject.asObservable();
  }
}
