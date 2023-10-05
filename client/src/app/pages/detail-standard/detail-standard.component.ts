import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { ActivatedRoute, Router  } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@Component({
  selector: 'app-detail-standard',
  templateUrl: './detail-standard.component.html',
  styleUrls: ['./detail-standard.component.css'],
  providers: [ConfirmationService, MessageService],
})

export class DetailStandardComponent implements OnInit {

  codeskill!: number;
  levelNames: string[] = [];
  skillDetails: any;

  selectedMetal: string | null = null;
  selectedLevelDescriptions: string[] = [];

  visible: boolean[] = [];

  isLoggedIn: boolean = false;
  message = '';

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.codeskill = params['codeskill']; // Get the skill code from route parameters
      this.fetchSkillDetails();
      this.http.get('http://localhost:8080/api/user', {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true)
          AuthInterceptor.accessToken
        },
        error: () => {
          Emitter.authEmitter.emit(false)
        }
      });
    });
  }

  checkLoginStatus() {
    this.http.get('http://localhost:8080/api/user')
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          window.location.reload()
        }
      });
  }

  showDialog(index: number) {
    this.visible[index] = true;
    this.checkLoginStatus();
  }

  showDetails(levelName: string) {
    this.http.get(`http://localhost:8080/api/search?codeskill=${this.codeskill}&level_name=${levelName}`)
      .subscribe(
        (details: any) => {
          this.selectedMetal = levelName;
          const selectedLevels = details[0]?.levels.filter((level: any) => level.level_name === levelName);

          if (selectedLevels && selectedLevels.length > 0) {
            const descriptions = selectedLevels.map((level: any) => level.descriptions[0]?.description_text || "");
            this.selectedLevelDescriptions = descriptions;
            this.visible = new Array(descriptions.length).fill(false);
          } else {
            this.selectedLevelDescriptions = ["Level not found"];
          }
        },
        (error) => {
          console.error('Error fetching skill details:', error);
        }
      );
  }

  closeAddLink(index: number) {
    this.visible[index] = false;
  }

  saveAddLink(index: number) {
    this.visible[index] = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add data successfully' });
  }

  fetchSkillDetails() {
    this.http.get(`http://localhost:8080/api/search?codeskill=${this.codeskill}`)
      .subscribe(
        (details: any) => { // ระบุชนิดข้อมูลที่คาดหวัง
          this.skillDetails = details;
          this.levelNames = details[0].levels.map((level: any) => level.level_name);
          this.levelNames = this.getUniqueItems(this.levelNames);
          for (let i = 0; i < this.levelNames.length; i++) {
            const levelName = this.levelNames[i];
          }
        },
        (error) => {
          console.error('Error fetching skill details:', error);
        }
      );
  }

  private getUniqueItems(array: string[]): string[] {
    const uniqueArray: string[] = [];
    array.forEach(item => {
      if (!uniqueArray.includes(item)) {
        uniqueArray.push(item);
      }
    });
    return uniqueArray;
  }
}