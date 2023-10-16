import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

import { FormBuilder, FormGroup } from '@angular/forms';

interface Information {
  info_id: number;
  info_text: string;
}

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
  selectedLevelDescriptions: { description_text: string, descid: string }[] = [];
  selectedDescriptionIndex: number | null = null;

  descid: string[] = [];

  visible: boolean[] = [];

  isLoggedIn: boolean = false;
  message = '';

  information: Information[] = [];
  updateForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.updateForm = this.formBuilder.group({
      info_id: '',
      info_text: '',
      descid: '',
    });
  }

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

  showDetails(levelName: string) {
    this.http.get(`http://localhost:8080/api/search?codeskill=${this.codeskill}&level_name=${levelName}`)
      .subscribe(
        (details: any) => {
          this.selectedMetal = levelName;
          const selectedLevels = details[0]?.levels.filter((level: any) => level.level_name === levelName);

          if (selectedLevels && selectedLevels.length > 0) {
            // สร้างอาร์เรย์ของคำอธิบายของทุก level ที่เกี่ยวข้อง
            const descriptions = selectedLevels.map((level: any) => {
              const description_text = level.descriptions[0]?.description_text || "";
              const descid = level.descriptions[0]?.id || "";
              return { description_text, descid };
            });
            // รวมข้อมูลใน descriptions และเขียนเป็นข้อความที่สามารถแสดงได้ใน HTML
            this.selectedLevelDescriptions = descriptions;
            console.log(this.selectedLevelDescriptions);
          } else {
            this.selectedLevelDescriptions = [{ description_text: "Level not found", descid: "" }];
          }
        },
        (error) => {
          console.error('Error fetching skill details:', error);
        }
      );
  }

  closeAddLink(index: any) {
    if (this.selectedDescriptionIndex !== null) { // เพิ่มการตรวจสอบนี้
      this.visible[this.selectedDescriptionIndex] = false;
    } else {
      // จัดการกรณีที่ this.selectedDescriptionIndex มีค่าเป็น null
      // อาจจะแสดงข้อความแจ้งเตือนหรือทำอย่างอื่นตามที่คุณต้องการ
    }
  }
  addDataSuccess: boolean = false;

  displayAddInfo: boolean = false;

  showDialog(i: number) {
    this.visible[i] = true;
    this.checkLoginStatus();
    this.displayAddInfo = true;
    this.selectedDescriptionIndex = i; // เก็บ index ของรายการที่เลือก
    this.updateForm.reset({
      info_text: '', // เมื่อแสดงป๊อปอัพให้รีเซ็ตค่าในฟอร์ม
    });
    const selectedDescription = this.selectedLevelDescriptions[i];
    console.log("Selected description_text:", selectedDescription.description_text);
    console.log("Selected descid:", selectedDescription.descid);
  }

  saveAddLink() {
    if (this.selectedDescriptionIndex !== null) { // เพิ่มการตรวจสอบนี้
      const formData = this.updateForm.value;
      const descid = this.selectedLevelDescriptions[this.selectedDescriptionIndex].descid; // ใช้ descid จาก selectedDescriptionIndex
      this.http.post(`http://localhost:8080/api/createDatacollection`, formData, {
        params: { descriptionId: descid }, // ใช้ descid จาก selectedDescriptionIndex
        withCredentials: true,
      }).subscribe({
        next: (res) => {
          console.log('Information created successfully:', res);
          this.fetchSkillDetails();
          this.displayAddInfo = false;
          this.updateForm.reset({
            info_text: '',
          });
        },
        error: (err) => {
          console.error('Error creating Information:', err);
        },
      });

      this.addDataSuccess = true;

      // Close the dialog and reset the form
      this.visible[this.selectedDescriptionIndex] = false;

      // Show a success message
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add data successfully' });
    } else {
      // จัดการกรณีที่ this.selectedDescriptionIndex มีค่าเป็น null
      // อาจจะแสดงข้อความแจ้งเตือนหรือทำอย่างอื่นตามที่คุณต้องการ
    }
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