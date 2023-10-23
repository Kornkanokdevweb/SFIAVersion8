import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

const API_URL = 'http://localhost:8080/api';

interface EducationInfo {
  education_id: string;
  syear: number;
  eyear: number;
  level_edu: string;
  universe: string;
  faculty: string;
  branch: string;
}

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class EducationComponent implements OnInit {
  education: EducationInfo[] = [];
  updateForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {
    this.updateForm = this.formBuilder.group({
      education_id: '',
      syear: '',
      eyear: '',
      level_edu: '',
      universe: '',
      faculty: '',
      branch: '',
    });
  }

  ngOnInit(): void {
    this.fetchEducationData();
    this.primengConfig.ripple = true;
  }

  fetchEducationData(): void {
    this.http
      .get<any>(`${API_URL}/getEducation`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.education = res.data;

          console.log(this.education);
        },
        error: () => {
          this.router.navigate(['/login']);
          console.error('You are not logged in');
          Emitter.authEmitter.emit(false);
        },
      });
  }

  displayAddEducation: boolean = false;
  displayEditEducation: boolean = false;

  AddEducation() {
    this.updateForm.patchValue({
      syear: '',
      eyear: '',
      level_edu: '',
      universe: '',
      faculty: '',
      branch: '',
    });
    this.displayAddEducation = true;
  }

  EditEducation(education: EducationInfo): void {
    this.updateForm.patchValue({
      education_id: education.education_id,
      syear: education.syear,
      eyear: education.eyear,
      level_edu: education.level_edu,
      universe: education.universe,
      faculty: education.faculty,
      branch: education.branch,
    });
    console.log(this.EditEducation);

    this.displayEditEducation = true;
  }

  saveAddEducation(): void {
    const formData = this.updateForm.value;

    // ส่งข้อมูลไปยัง API สร้างการศึกษา
    this.http
      .post(`${API_URL}/createEducation`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          // หลังจากสร้างข้อมูลสำเร็จ
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Education created successfully' });
          console.log('Education created successfully:', res);
          this.fetchEducationData(); // รีเฟรชรายการการศึกษาหลังจากสร้าง
          this.displayAddEducation = false; // ปิดหน้าต่างเพิ่มการศึกษา

          // เคลียร์ฟอร์มหลังจากบันทึกข้อมูล
          this.updateForm.reset({
            syear: '',
            eyear: '',
            level_edu: '',
            universe: '',
            faculty: '',
            branch: '',
          });
        },
        error: (err) => {
          console.error('Error creating education:', err);
        },
      });
  }

  saveEditEducation(): void {
    const formData = this.updateForm.value;
    const educationId = formData.education_id;
    console.log(formData);

    // ส่งข้อมูลการแก้ไขไปยัง API
    this.http
      .put(`${API_URL}/updateEducation?education_id=${educationId}`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          // หลังจากแก้ไขข้อมูลสำเร็จ
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Education updated successfully' });
          console.log('Education updated successfully:', res);
          this.fetchEducationData(); // รีเฟรชรายการการศึกษาหลังจากแก้ไข
          this.displayEditEducation = false; // ปิดหน้าต่างแก้ไขการศึกษา
        },
        error: (err) => {
          console.error('Error updating education:', err);
        },
      });
  }

  DeleteEducation(education: EducationInfo) {
    this.updateForm.patchValue({
      education_id: education.education_id,
      syear: education.syear,
      eyear: education.eyear,
      level_edu: education.level_edu,
      universe: education.universe,
      faculty: education.faculty,
      branch: education.branch,
    });
    this.messageService.add({
      key: 'confirm', sticky: true, severity: 'warn', summary: 'Confirmation', detail: 'Are you sure you want to proceed?',
    });
  }

  onConfirm() {
    const formData = this.updateForm.value;
    const educationId = formData.education_id;

    // เรียกใช้ API สำหรับการลบข้อมูลการศึกษา
    this.http
      .delete(`${API_URL}/deleteEducation?education_id=${educationId}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log('Education deleted successfully:', res);
          this.fetchEducationData(); // รีเฟรชรายการการศึกษาหลังจากลบ
          this.messageService.clear('confirm'); // ลบข้อความยืนยัน
          this.messageService.add({
            severity: 'success', summary: 'Confirmed', detail: 'Education deleted successfully',
          });
        },
        error: (err) => {
          console.error('Error deleting education:', err);
          this.messageService.clear('confirm'); // ลบข้อความยืนยัน
          this.messageService.add({
            severity: 'error', summary: 'Error', detail: 'Failed to delete education',
          });
        },
      });
  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error', summary: 'Rejected', detail: 'You have rejected',
    });
  }
}
