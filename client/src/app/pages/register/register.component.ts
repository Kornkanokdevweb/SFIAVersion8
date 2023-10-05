import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // เพิ่ม Validators เข้ามา
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { matchPassword } from './matchPassword.validator';
import { MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // ไม่ต้องใช้ ! สำหรับ registerForm และเพิ่ม Validators เข้ามา

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/user')
      .subscribe({
        next: (res: any) => {
          this.router.navigate(['/']);
        },
        error: () => {
          Emitter.authEmitter.emit(false)
        }
      });
    this.registerForm = this.formBuilder.group(
      {
        email: ['', Validators.required], // เพิ่ม Validators.required เพื่อตรวจสอบว่า email ไม่เป็นค่าว่าง
        password: ['', Validators.required], // เพิ่ม Validators.required เพื่อตรวจสอบว่า password ไม่เป็นค่าว่าง
        ConfirmPassword: ['', Validators.required], // เพิ่ม Validators.required เพื่อตรวจสอบว่า ConfirmPassword ไม่เป็นค่าว่าง
        AcceptTerms: '' // เพิ่ม Validators.requiredTrue เพื่อตรวจสอบว่า AcceptTerms เป็น true
      },
      {
        validators: matchPassword
      }
    );
  }

  register() {
    if (this.registerForm.valid) { // ตรวจสอบว่าฟอร์มถูกต้อง
      this.http.post('http://localhost:8080/api/register', this.registerForm.getRawValue(), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response'
      }).subscribe(
        (response) => {
          if (response.status === 200) {
            const emailData = {
              email: this.registerForm.get('email')?.value,
              text: '',
              subject: ''
            };

            // Call your API router.post('/registerMail', registerMail) here with emailData
            this.http.post('http://localhost:8080/api/registerMail', emailData, {
              headers: new HttpHeaders({
                'Content-Type': 'application/json'
              }),
              observe: 'response'
            }).subscribe(
              () => {
                // Handle success for the registerMail API
              },
              (error) => {
                // Handle error for the registerMail API
              }
            );
          }

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful. Please log in.' });

          // Delay navigation to login by 2 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // Delay in milliseconds
        },
        (error) => {
          if (error.error && error.error.message) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred' });
          }
        }
      );
    }
  }
}