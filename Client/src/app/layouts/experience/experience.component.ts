import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

const API_URL = 'http://localhost:8080/api';

interface ExperienceInfo {
  exp_id: string;
  exp_text: number;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ExperienceComponent implements OnInit {
  experience: ExperienceInfo[] = [];
  updateForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
  ) {
    this.updateForm = this.formBuilder.group({
      exp_id: '',
      exp_text: '',
    });
  }
  
  ngOnInit(): void {
    this.fetchExperienceData();
  }

  fetchExperienceData(): void {
    this.http
      .get<any>(`${API_URL}/getExperience`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.experience = res.data;

          console.log(this.experience);
        },
        error: () => {
          this.router.navigate(['/login']);
          console.error('You are not logged in');
          Emitter.authEmitter.emit(false);
        },
      });
  }

  displayAddExperience: boolean = false;
  displayEditExperience: boolean = false;

  AddExperience() {
    this.updateForm.patchValue({
      exp_text: '',
    });
    this.displayAddExperience = true;
  }

  EditExperience(experience: ExperienceInfo) {
    this.updateForm.patchValue({
      exp_id: experience.exp_id,
      exp_text: experience.exp_text,
    });
    console.log(this.EditExperience);

    this.displayEditExperience = true;
  }

  saveAddExperience(): void {
    const formData = this.updateForm.value;

    this.http
      .post(`${API_URL}/createExperience`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          // หลังจากสร้างข้อมูลสำเร็จ
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Experience created successfully' });
          console.log('Experience created successfully:', res);
          this.fetchExperienceData(); // รีเฟรชรายการการศึกษาหลังจากสร้าง
          this.displayAddExperience = false; // ปิดหน้าต่างเพิ่มการศึกษา

          // เคลียร์ฟอร์มหลังจากบันทึกข้อมูล
          this.updateForm.reset({
            exp_text: '',
          });
        },
        error: (err) => {
          console.error('Error creating experience:', err);
        },
      });
  }

  saveEditExperience(): void {
    const formData = this.updateForm.value;
    const experienceId = formData.exp_id;
    console.log(formData);

    this.http
      .put(`${API_URL}/updateExperience?exp_id=${experienceId}`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Experience updated successfully' });
          console.log('Experience updated successfully:', res);
          this.fetchExperienceData();
          this.displayEditExperience = false;
        },
        error: (err) => {
          console.error('Error updating education:', err);
        },
      });
  }

  DeleteExperience(experience: ExperienceInfo) {
    this.updateForm.patchValue({
      exp_id: experience.exp_id,
      exp_text: experience.exp_text,
    });
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmation',
      detail: 'Are you sure you want to proceed?',
    });
  }

  onConfirm() {
    const formData = this.updateForm.value;
    const experienceId = formData.exp_id;

    // เรียกใช้ API สำหรับการลบข้อมูลการศึกษา
    this.http
      .delete(`${API_URL}/deleteExperience?exp_id=${experienceId}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log('Experience deleted successfully:', res);
          this.fetchExperienceData(); // รีเฟรชรายการการศึกษาหลังจากลบ
          this.messageService.clear('confirm'); // ลบข้อความยืนยัน
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Experience deleted successfully',
          });
        },
        error: (err) => {
          console.error('Error deleting experience:', err);
          this.messageService.clear('confirm'); // ลบข้อความยืนยัน
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete experience',
          });
        },
      });
  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected',
    });
  }
}
