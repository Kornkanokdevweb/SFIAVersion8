import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StoreEmailService } from 'src/app/service/store-email.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private emailService: StoreEmailService
    ) {
  }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email:''
    })
  }

  resetPassword() {
    const email = this.resetForm.getRawValue().email; // รับค่าอีเมลจากฟอร์ม
    this.emailService.setEmail(email); // เซ็ตค่า email ด้วย Service
    
    // เข้าถึงค่า email จาก Service และ log ออกมา
    const storedEmail = this.emailService.getEmail();
    console.log('Email stored in service:', storedEmail);

    // ต่อไปคุณสามารถเรียกใช้ this.emailService.getEmail() เพื่อเข้าถึงค่า email ที่เก็บไว้
    this.http.get(`http://localhost:8080/api/generateOTP?email=${email}`).subscribe(
      (response) => {
        this.router.navigate(['/recovery-password']);
        console.log('OTP sent successfully:', response);
        // ทำสิ่งที่คุณต้องการเมื่อ OTP ถูกส่ง
      },
      (error) => {
        console.error('Failed to send OTP:', error);
        // ทำสิ่งที่คุณต้องการเมื่อส่ง OTP ไม่สำเร็จ
      }
    );
  }
}