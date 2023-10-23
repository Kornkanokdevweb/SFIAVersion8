import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

const API_URL = 'http://localhost:8080/api';

interface LinkInfo {
  link_id: string;
  link_name: string;
  link_text: string;
}

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class LinkComponent implements OnInit {
  link: LinkInfo[] = [];
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
      link_id: '',
      link_name: '',
      link_text: '',
    });
  }

  ngOnInit(): void {
    this.fetchLinkData();
    this.primengConfig.ripple = true;
  }

  fetchLinkData(): void {
    this.http
      .get<any>(`${API_URL}/getLink`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.link = res.data;

          console.log(this.link);
        },
        error: () => {
          this.router.navigate(['/login']);
          console.error('You are not logged in');
          Emitter.authEmitter.emit(false);
        },
      });
  }
  displayAddLink: boolean = false;
  displayEditLink: boolean = false;

  AddLink() {
    this.updateForm.patchValue({
      link_name: '',
      link_text: '',
    });
    this.displayAddLink = true;
  }

  EditLink(link: LinkInfo): void {
    this.updateForm.patchValue({
      link_id: link.link_id,
      link_name: link.link_name,
      link_text: link.link_text,
    });
    console.log(this.EditLink);

    this.displayEditLink = true;
  }

  saveAddLink(): void {
    const formData = this.updateForm.value;

    // ส่งข้อมูลไปยัง API สร้างการศึกษา
    this.http
      .post(`${API_URL}/createLink`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          // หลังจากสร้างข้อมูลสำเร็จ
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Link created successfully' });
          console.log('Link created successfully:', res);
          this.fetchLinkData(); // รีเฟรชรายการการศึกษาหลังจากสร้าง
          this.displayAddLink = false; // ปิดหน้าต่างเพิ่มการศึกษา

          // เคลียร์ฟอร์มหลังจากบันทึกข้อมูล
          this.updateForm.reset({
            link_name: '',
            link_text: '',
          });
        },
        error: (err) => {
          console.error('Error creating link:', err);
        },
      });
  }

  saveEditLink(): void {
    const formData = this.updateForm.value;
    const linkId = formData.link_id;
    console.log(formData);

    // ส่งข้อมูลการแก้ไขไปยัง API
    this.http
      .put(`${API_URL}/updateLink?link_id=${linkId}`, formData, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          // หลังจากแก้ไขข้อมูลสำเร็จ
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Link updated successfully' });
          console.log('Link updated successfully:', res);
          this.fetchLinkData(); // รีเฟรชรายการการศึกษาหลังจากแก้ไข
          this.displayEditLink = false; // ปิดหน้าต่างแก้ไขการศึกษา
        },
        error: (err) => {
          console.error('Error updating link:', err);
        },
      });
  }

  DeleteLink(link: LinkInfo) {
    this.updateForm.patchValue({
      link_id: link.link_id,
      link_name: link.link_name,
      link_text: link.link_text,
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
    const linkId = formData.link_id;

    // เรียกใช้ API สำหรับการลบข้อมูลการศึกษา
    this.http
      .delete(`${API_URL}/deleteLink?link_id=${linkId}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log('Link deleted successfully:', res);
          this.fetchLinkData(); // รีเฟรชรายการการศึกษาหลังจากลบ
          this.messageService.clear('confirm'); // ลบข้อความยืนยัน
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Link deleted successfully',
          });
        },
        error: (err) => {
          console.error('Error deleting link:', err);
          this.messageService.clear('confirm');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete link',
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
