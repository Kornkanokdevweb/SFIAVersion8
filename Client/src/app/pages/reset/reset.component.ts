import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // เพิ่ม Validators เข้ามา
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StoreEmailService } from 'src/app/service/store-email.service';
import { MessageService } from 'primeng/api';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css'],
  providers: [MessageService]
})
export class ResetComponent implements OnInit {
  resetForm!: FormGroup;
  storedEmail: string = ''; // สร้างตัวแปรเพื่อเก็บค่า email ที่มาจาก Service
  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private emailService: StoreEmailService,
    private messageService: MessageService,
    private envEndpointService: EnvEndpointService
  ) { }

  ngOnInit(): void {
    this.storedEmail = this.emailService.getEmail();
    if (!this.storedEmail) {
      this.router.navigate(['/reset-password']);
      return;
    }

    this.resetForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, Validators.pattern(passwordValidator)]],
        confirmPassword: ['', Validators.required],
      },
    );
  }

  isLoading = false;


  resetPassword() {
    this.isLoading = true;
    if (this.resetForm.invalid) {
      return;
    }
    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match' });
      this.isLoading = false;
      return;
    }
    this.isLoading = false;
    const storedEmail = this.emailService.getEmail();

    const resetData = {
      email: storedEmail,
      password: newPassword
    };

    this.http.put(`${this.ENV_REST_API}/resetPassword`, resetData).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successfull.' });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);

      },
      (error) => {
        if (error.error && error.error.error === 'New password must be different from the old password') {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Password reset failed. New password must be different from the old password',
          });
        } else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Password reset failed' });
        }
      }
    );
  }
}