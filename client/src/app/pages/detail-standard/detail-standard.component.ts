import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { window } from 'rxjs';

interface LevelDescription {
  description_text: string;
  descid: string;
}

interface Information {
  info_id: number;
  info_text: string;
  descid: string;
}

@Component({
  selector: 'app-detail-standard',
  templateUrl: './detail-standard.component.html',
  styleUrls: ['./detail-standard.component.css'],
  providers: [ConfirmationService, MessageService],
})

export class DetailStandardComponent implements OnInit {

  updateInfoText: string | null = null;

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
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    this.http.get('http://localhost:8080/api/user')
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true);
          this.isLoggedIn = true;
        },
        error: () => {
          this.isLoggedIn = false;
          this.router.navigate(['/login']); // ตั้งค่า URL ของหน้าล็อกอินตามที่คุณต้องการ
        }
      });
  }

  fetchSkillDetails() {
    this.http.get(`http://localhost:8080/api/search?codeskill=${this.codeskill}`)
      .subscribe(
        (details: any) => {
          this.skillDetails = details;
          this.levelNames = details[0].levels.map((level: any) => level.level_name);
          this.levelNames = this.getUniqueItems(this.levelNames);
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
          console.log(this.selectedMetal);
          console.log(this.codeskill);
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
            const descids = this.selectedLevelDescriptions.map(description => description.descid.trim());
            console.log("descidssss", descids);
            console.log(this.selectedLevelDescriptions);
            this.getInformation(descids);
          } else {
            this.selectedLevelDescriptions = [{ description_text: "Level not found", descid: "" }];
          }
        }
      );
  }

  getInformation(descids: string[]) {
    this.http.get(`http://localhost:8080/api/getDatacollection`, { withCredentials: true })
      .subscribe(
        (data: any) => {
          // กรองข้อมูล info_text โดยใช้ descids
          this.information = data.information
            .filter((info: { description: { id: string; }; }) => descids.includes(info.description.id.toString()))
            .map((info: any) => {
              const info_id = info.id;
              const info_text = info.info_text;
              const descid = info.description.id.toString();

              return { info_id, info_text, descid };
            });

          console.log(this.information); // แสดงข้อมูล information ในคอนโซล
        },
        (error) => {
          console.error('Error fetching skill details:', error);
        }
      );
  }

  getInformationByDescid(descid: string): string {
    const informationRecord = this.information.find(info => info.descid.toString() === descid);
    return informationRecord ? informationRecord.info_text : '';
  }

  displayAddInfo: boolean = false;
  showInformationDetail: boolean[] = [];

  addInformation(i: number) {
    if (this.isLoggedIn) {
      this.visible[i] = true;
      this.displayAddInfo = true;
      this.selectedDescriptionIndex = i;
      this.showInformationDetail[i] = true;
    } else {
      this.router.navigate(['/login']);
    }

    const selectedDescription = this.selectedLevelDescriptions[i];
    const descid = selectedDescription.descid;
    console.log("Selected descid:", selectedDescription.descid);
  }

  updatedDescStatus: boolean[] = [];

  saveAddInformation() {
    if (this.selectedDescriptionIndex !== null) {
      const formData = this.updateForm.value;
      const descid = this.selectedLevelDescriptions[this.selectedDescriptionIndex].descid;

      this.http.post(`http://localhost:8080/api/createDatacollection`, formData, {
        params: { descriptionId: descid },
        withCredentials: true,
      }).subscribe({
        next: (res: any) => { // ระบุประเภทของ 'res' เป็น 'any' เพื่อให้มีคุณสมบัติ 'info_id' ใช้ได้
          console.log('Information created successfully:', res);

          // อัปเดตสถานะของ descid เพื่อบอกว่ามีข้อมูลใหม่สำหรับ descid นี้
          if (this.selectedDescriptionIndex !== null) {
            this.updatedDescStatus[this.selectedDescriptionIndex] = true;
          }

          // อัปเดตหรือเพิ่มข้อมูลที่ถูกบันทึกไปที่ information array

          const info_text = formData.info_text;
          const newInformation = { info_id: res.info_id, info_text, descid };
          this.information.push(newInformation);
          this.getInformationByDescid(descid);

          // หลังจากจบการทำงาน ตั้งค่า visible ให้เป็น false เพื่อปิด dialog
          if (this.selectedDescriptionIndex !== null) {
            this.visible[this.selectedDescriptionIndex] = false;
          }

          

          this.updateForm.reset({
            info_text: '',
          });
          
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add data successfully' });
          
        },
        error: (err) => {
          console.error('Error creating Information:', err);
        },
      });
    }
  }

  displayEditInformation: boolean = false;

  editInformation(information: Information) {
    this.updateForm.patchValue({
      info_id: information.info_id,
      info_text: information.info_text,
      descid: information.descid

    });
    console.log(this.editInformation);

    this.displayEditInformation = true;
  }

  saveEditInformation() {
    const formData = this.updateForm.value;
    const informationId = formData.info_id;

    console.log(informationId);
    this.http.put(`http://localhost:8080/api/updateDatacollection`, formData, {
      params: { informationId: informationId },
      withCredentials: true,
    }).subscribe({
      next: (res: any) => {
        console.log('Information updated successfully:', res);
        this.getInformation(this.selectedLevelDescriptions.map(desc => desc.descid));
        this.displayEditInformation = false;
        
      },
      error: (err) => {
        console.error('Error updating Information:', err);
      },
    });

  }

  // ในเมทอด deleteInformation
  deleteInformation(information: Information) {
    this.updateForm.patchValue({
      info_id: information.info_id, // เพิ่ม informationId ลงในฟอร์ม
      info_text: information.info_text,
      descid: information.descid
    });
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmation',
      detail: 'Are you sure you want to proceed?'
    });
  }


  onConfirm() {
    const formData = this.updateForm.value;
    const informationId = formData.info_id;

    this.http.delete(`http://localhost:8080/api/deleteDatacollection`, {
      params: { informationId: informationId },
      withCredentials: true,
    }).subscribe({
      next: (res) => {
        console.log('Information deleted successfully:', res);
        this.getInformation(this.selectedLevelDescriptions.map(desc => desc.descid));
        this.messageService.clear('confirm');
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Information deleted successfully',
        });
      },
      error: (err) => {
        console.error('Error deleting Information:', err);
        this.messageService.clear('confirm');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete Information',
        });
      },
    });

  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'you have rejected'
    })
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
