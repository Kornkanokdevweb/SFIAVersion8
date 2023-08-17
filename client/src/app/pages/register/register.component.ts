import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http' 
import { Router } from '@angular/router';
import { matchPassword } from './matchPassword.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ){
    
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: '',
      password: '',
      ConfirmPassword: '',
      AcceptTerms: ''
    },{
      validators: matchPassword
    });
  }

  register(){
    this.http.post('http://localhost:8080/api/register', this.registerForm.getRawValue())
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
  
}
