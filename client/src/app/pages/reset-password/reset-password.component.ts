import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StoreEmailService } from 'src/app/service/store-email.service';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  isLoading: boolean = false;
  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router,
    private emailService: StoreEmailService,
    private envEndpointService: EnvEndpointService
  ) {
  }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email:  ['', [Validators.required, Validators.pattern(emailValidator)]],
    })
  }

  resetPassword() {
    const email = this.resetForm.getRawValue().email; // รับค่าอีเมลจากฟอร์ม
    this.emailService.setEmail(email); // เซ็ตค่า email ด้วย Service
    this.isLoading = true;

    // เข้าถึงค่า email จาก Service และ log ออกมา
    const storedEmail = this.emailService.getEmail();
    console.log('Email stored in service:', storedEmail);

    // ต่อไปคุณสามารถเรียกใช้ this.emailService.getEmail() เพื่อเข้าถึงค่า email ที่เก็บไว้
    this.http.get(`${this.ENV_REST_API}/generateOTP?email=${email}`).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'OTP sent successfully.' });
        setTimeout(() => {
          this.router.navigate(['/recovery-password']);
          this.isLoading = false;
        }, 3000); // Delay in milliseconds

        console.log('OTP sent successfully:');
        // ทำสิ่งที่คุณต้องการเมื่อ OTP ถูกส่ง
      },
      (error) => {
        console.error('Failed to send OTP:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send OTP' });
        // ทำสิ่งที่คุณต้องการเมื่อส่ง OTP ไม่สำเร็จ
      }
    );
  }
}