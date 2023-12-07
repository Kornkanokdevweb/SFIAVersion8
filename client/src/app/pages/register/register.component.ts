import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // เพิ่ม Validators เข้ามา
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { matchPassword } from './matchPassword.validator';
import { MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private envEndpointService: EnvEndpointService
  ) {}

  ngOnInit(): void {
    this.http.get(`${this.ENV_REST_API}/user`)
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
        email: ['', [Validators.required, Validators.pattern(emailValidator)]],
        password: ['', [Validators.required, Validators.pattern(passwordValidator)]],
        ConfirmPassword: ['', Validators.required],
      },
      {
        validators: matchPassword
      }
    );
  }

  register() {
    if (this.registerForm.valid) { 
      this.http.post(`${this.ENV_REST_API}/register`, this.registerForm.getRawValue(), {
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
            this.http.post(`${this.ENV_REST_API}/registerMail`, emailData, {
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
    }else {
      // Add toast message for invalid form
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all required fields.' });
    }
  }
  
}