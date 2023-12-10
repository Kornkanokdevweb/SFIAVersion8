import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StoreEmailService } from 'src/app/service/store-email.service';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css'],
  providers: [MessageService]
})
export class RecoveryPasswordComponent implements OnInit {
  recoveryForm!: FormGroup;
  storedEmail: string = '';

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private emailService: StoreEmailService,
    private renderer: Renderer2,
    private el: ElementRef,
    private envEndpointService: EnvEndpointService
  ) { }

  ngOnInit(): void {
    this.storedEmail = this.emailService.getEmail();
    if (!this.storedEmail) {
      this.router.navigate(['/reset-password']);
      return;
    }

    this.initRecoveryForm();
    console.log('Stored Email:', this.storedEmail);
  }

  onInput(event: Event, currentField: string, nextField: string | null, prevField: string | null) {
    console.log('Input event triggered:', currentField);
    const input = event.target as HTMLInputElement;
    const value = input.value;

    console.log('Value:', value);
  
    if (value && nextField) {
      console.log('Moving to next field:', nextField);
      const nextInput = this.el.nativeElement.querySelector(`[formControlName="${nextField}"]`);
      if (nextInput) {
        this.renderer.selectRootElement(nextInput).focus();
      }
    } else if (!value && prevField) {
      console.log('Moving to previous field:', prevField);
      const prevInput = this.el.nativeElement.querySelector(`[formControlName="${prevField}"]`);
      if (prevInput) {
        this.renderer.selectRootElement(prevInput).focus();
      }
    }
  }
  
  onKeyDown(event: KeyboardEvent, currentField: string, nextField: string | null, prevField: string | null) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    if (event.key === 'Backspace' && !value && prevField) {
      const prevInput = this.el.nativeElement.querySelector(`[formControlName="${prevField}"]`);
      if (prevInput) {
        this.renderer.selectRootElement(prevInput).focus();
        event.preventDefault(); // prevent the default Backspace behavior
      }
    } else if (event.key !== 'Backspace' && value && nextField) {
      console.log('Moving to next field:', nextField);
      const nextInput = this.el.nativeElement.querySelector(`[formControlName="${nextField}"]`);
      if (nextInput) {
        this.renderer.selectRootElement(nextInput).focus();
      }
    } else if (!nextField) {
      event.preventDefault(); // prevent moving to the next input if there is no next field
    }
  }
  

  initRecoveryForm() {
    this.recoveryForm = this.formBuilder.group({
      code1: ['', Validators.required],
      code2: ['', Validators.required],
      code3: ['', Validators.required],
      code4: ['', Validators.required],
      code5: ['', Validators.required],
      code6: ['', Validators.required],
    });
  }
  recovery() {
    const code = Object.values(this.recoveryForm.getRawValue()).join('');
    const recoveryData = {
      code: code,
      email: this.storedEmail
    };

    this.http.get(`${this.ENV_REST_API}/verifyOTP`, { params: recoveryData })
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
  isLoading = false;
  timeRemaining = 60; // จำนวนวินาทีที่ต้องการให้นับถอยหลัง
  
  resendOTP() {
      this.isLoading = true;
      const email = this.storedEmail;
  
      this.http.get(`${this.ENV_REST_API}/generateOTP?email=${email}`).subscribe(
          (response) => {
              console.log('OTP sent successfully:');
              // ทำสิ่งที่คุณต้องการเมื่อ OTP ถูกส่ง
              this.startCountdown();
          },
          (error) => {
              console.error('Failed to send OTP:', error);
              // ทำสิ่งที่คุณต้องการเมื่อส่ง OTP ไม่สำเร็จ
              this.isLoading = false;
          }
      );
  }
  
  startCountdown() {
      const countdownInterval = setInterval(() => {
          this.timeRemaining--;
          if (this.timeRemaining <= 0) {
              clearInterval(countdownInterval);
              this.isLoading = false;
              this.timeRemaining = 60; // รีเซ็ตเวลาเมื่อนับถอยหลังเสร็จสิ้น
          }
      }, 1000); // นับถอยหลังทุก 1 วินาที
  }
  
  formatTime(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(remainingSeconds).padStart(2, '0');
      return `${formattedMinutes}:${formattedSeconds}`;
  }
  

}