import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StoreEmailService } from 'src/app/service/store-email.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  resetForm!: FormGroup;
  storedEmail: string = ''; // สร้างตัวแปรเพื่อเก็บค่า email ที่มาจาก Service

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private emailService: StoreEmailService
  ){}

  ngOnInit(): void {
    this.storedEmail = this.emailService.getEmail();
    // ตรวจสอบว่าถ้าไม่มีค่า storedEmail ให้กลับไปที่หน้า resetPassword
    if (!this.storedEmail) {
      this.router.navigate(['/reset-password']); // เปลี่ยนเส้นทางไปยังหน้า resetPassword
      return; // ออกจาก ngOnInit เพื่อไม่ให้ดำเนินการต่อ
    }
    
    this.resetForm = this.formBuilder.group(
      {
        newPassword: '',
        confirmPassword: ''
      },
    );
  }

  resetPassword() {
    const newPassword = this.resetForm.get('newPassword')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;
  
    if (newPassword !== confirmPassword) {
      // แสดงข้อความผิดพลาดหรือทำการจัดการเมื่อรหัสผ่านไม่ตรงกัน
      console.error('Passwords do not match');
      return;
    }
  
    const storedEmail = this.emailService.getEmail(); // รับค่าอีเมลที่เก็บไว้ใน Service
  
    const resetData = {
      email: storedEmail, // ใช้ค่าอีเมลจาก Service
      password: newPassword
    };
  
    this.http.put('http://localhost:8080/api/resetPassword', resetData).subscribe(
      (response: any) => {
        // รับข้อมูลการตอบสนองจาก API เมื่อรีเซ็ตรหัสผ่านสำเร็จ
        console.log('Password reset successful:', response);
        // ทำการเรียกใช้งาน Router เพื่อเปลี่ยนหน้าหลังจากการรีเซ็ตรหัสผ่าน
        this.router.navigate(['/login']); // เปลี่ยนเส้นทางไปยังหน้า login หรือหน้าอื่นๆ ตามที่คุณต้องการ
      },
      (error) => {
        // จัดการข้อผิดพลาดเมื่อการรีเซ็ตรหัสผ่านไม่สำเร็จ
        console.error('Password reset failed:', error);
        // คุณสามารถแสดงข้อความผิดพลาดหรือทำการจัดการเพิ่มเติมได้ตามความเหมาะสม
      }
    );
  }
  

}