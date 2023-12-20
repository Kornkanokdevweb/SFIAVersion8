import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
import { Title } from '@angular/platform-browser';

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

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private envEndpointService: EnvEndpointService,
    private titleService: Title
  ) {

  }

  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | Login');
    this.http.get(`${this.ENV_REST_API}/user`)
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
    this.http.post(`${this.ENV_REST_API}/login`, this.loginForm.getRawValue(), { withCredentials: true })
      .subscribe(
        (res: any) => {
          AuthInterceptor.accessToken = res.token;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful.' });

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);

          this.titleService.setTitle('SFIAV8 | Home');
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect email or password.' });
        }
      );
  }
}