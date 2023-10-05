import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';

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
      email: '',
      password: '',
    });
  }

  login() {
    this.http.post('http://localhost:8080/api/login', this.loginForm.getRawValue(), { withCredentials: true })
      .subscribe((res: any) => {
        AuthInterceptor.accessToken = res.token;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful.' });
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000); // Delay in milliseconds
      });
  }

}