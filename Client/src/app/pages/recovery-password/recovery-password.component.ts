import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StoreEmailService } from 'src/app/service/store-email.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css'],
  providers: [MessageService]
})
export class RecoveryPasswordComponent implements OnInit {
  recoveryForm!: FormGroup;
  storedEmail: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private emailService: StoreEmailService
  ) {}

  ngOnInit(): void {
    this.storedEmail = this.emailService.getEmail();
    if (!this.storedEmail) {
      this.router.navigate(['/reset-password']);
      return;
    }

    this.initRecoveryForm();
    console.log('Stored Email:', this.storedEmail);
  }

  initRecoveryForm() {
    this.recoveryForm = this.formBuilder.group({
      code: ''
    });
  }

  recovery() {
    const recoveryData = {
      code: this.recoveryForm.getRawValue().code,
      email: this.storedEmail
    };

    this.http.get('http://localhost:8080/api/verifyOTP', { params: recoveryData })
      .subscribe(
        (response: any) => {
          if (response.message === "Verify Success") {
            this.router.navigate(['/reset']);
          } else {
            console.error('Unexpected API response:', response);
          }
        },
        (error) => {
          if (error.status === 400 && error.error && error.error.error === "Invalid OTP") {
            // Handle the "Invalid OTP" error here (e.g., display an error message to the user).
            console.log('Wrong OTP! Check email again!')
          } else {
            console.error('API Error:', error);
          }
        }
      );
  }

  resendOTP() {
    const email = this.storedEmail; // ใช้ค่า email ที่เก็บไว้
    this.http.get(`http://localhost:8080/api/generateOTP?email=${email}`).subscribe(
      (response) => {
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