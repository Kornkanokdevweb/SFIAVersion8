import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';

const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
  ) {

  }

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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailValidator)]],
      password: ['', [Validators.required,]],
    });
  }

  login() {
    this.http.post('http://localhost:8080/api/login', this.loginForm.getRawValue(), { withCredentials: true })
      .subscribe(
        (res: any) => {
          AuthInterceptor.accessToken = res.token;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful.' });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000); // Delay in milliseconds
        },
        (error) => {
          console.error('Login failed:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect email or password.' });
        }
      );
  }
}