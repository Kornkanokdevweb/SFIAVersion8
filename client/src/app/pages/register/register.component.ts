import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';
import { matchPassword } from './matchPassword.validator';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
  ) {

  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: '',
      password: '',
      ConfirmPassword: '',
      AcceptTerms: ''
    }, {
      validators: matchPassword
    });
  }

  register() {
    this.http.post('http://localhost:8080/api/register', this.registerForm.getRawValue())
      .subscribe(
        () => {
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
