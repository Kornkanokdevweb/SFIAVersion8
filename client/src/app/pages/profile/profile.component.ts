import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Emitter } from 'src/app/emitters/emitter';
import { MessageService } from 'primeng/api';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

interface UserProfile {
  profileImage: string;
  email: string;
  line: string;
  firstNameTH: string;
  lastNameTH: string;
  firstNameEN: string;
  lastNameEN: string;
  phone: string;
  address: string;
  updated_at: Date;
}

const thaiNameValidator = /^[ก-๏\s]+$/;
const thaiSurnameValidator = /^[ก-๏\s]+$/;
const englishNameValidator = /^[A-Za-z\s]+$/;
const englishSurnameValidator = /^[A-Za-z\s]+$/;
const phoneValidator = /^[0-9]{10}$/;
const addressValidator = /^[a-zA-Z0-9\sก-๏,.-/]+$/;
const lineIdValidator = /^[\w-.@]{1,100}$/;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`
  images: any;
  selectedImageURL: string | undefined;

  updateForm: FormGroup;
  user: UserProfile = {
    profileImage: '',
    email: '',
    line: '',
    firstNameTH: '',
    lastNameTH: '',
    firstNameEN: '',
    lastNameEN: '',
    phone: '',
    address: '',
    updated_at: new Date(),
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private envEndpointService: EnvEndpointService,
  ) {
    this.updateForm = this.formBuilder.group({
      profileImage: '',
      line: ['', [Validators.required, Validators.pattern(lineIdValidator)]],
      firstNameTH: ['', [Validators.required, Validators.pattern(thaiNameValidator)]],
      lastNameTH: ['', [Validators.required, Validators.pattern(thaiSurnameValidator)]],
      firstNameEN: ['', [Validators.required, Validators.pattern(englishNameValidator)]],
      lastNameEN: ['', [Validators.required, Validators.pattern(englishSurnameValidator)]],
      phone: ['', [Validators.required, Validators.pattern(phoneValidator)]],
      address: ['', [Validators.required, Validators.pattern(addressValidator)]],
      updated_at: new Date(),
    });
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.http.get<UserProfile>(`${this.ENV_REST_API}/user`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.user = res;
          Emitter.authEmitter.emit(true);
          this.setFormValuesFromUserData();
        },
        error: () => {
          this.router.navigate(['/login']);
          console.error('You are not logged in');
          Emitter.authEmitter.emit(false);
        }
      });
  }

  private setFormValuesFromUserData(): void {
    this.updateForm.patchValue({
      profileImage: this.user.profileImage,
      line: this.user.line,
      firstNameTH: this.user.firstNameTH,
      lastNameTH: this.user.lastNameTH,
      firstNameEN: this.user.firstNameEN,
      lastNameEN: this.user.lastNameEN,
      phone: this.user.phone,
      address: this.user.address
    });
  }

  private updateUserWithNewData(updatedData: any): void {
    this.user = { ...this.user, ...updatedData };
  }

  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      console.log(file);
      this.images = file;
      this.selectedImageURL = URL.createObjectURL(file);
    } else {
      const fileName = event.target.value
      console.log(fileName)
    }
  }

  visible: boolean = false;

  showConfirm() {
    if (!this.visible) {
      this.messageService.add({ 
      key: 'confirm', 
      sticky: true, 
      severity: 'warn', 
      summary: 'Are you sure?', 
      detail: 'Confirm to proceed' 
    });
      this.visible = true;
    }
  }

  updateProfile() {
    const phoneRegex = /[^0-9]/g;
    const updatedData = {
      ...this.updateForm.value,
      phone: this.updateForm.value.phone ? this.updateForm.value.phone.replace(phoneRegex, '') : ''
    };

    const formData = new FormData();
    if (this.images) {
      formData.append('file', this.images);
    }

    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] !== null && updatedData[key] !== undefined) {
        formData.append(key, updatedData[key]);
      }
    });

    console.log('Updated Data:', updatedData);

    this.http.put(`${this.ENV_REST_API}/updateUser`, formData, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully' });
          console.log('Profile updated successfully', res);
          this.updateUserWithNewData(updatedData);

          this.user.updated_at = new Date();
          console.log(this.user.updated_at)

        },
        error: (error) => {
          if (error.error && error.error.message === "Can't update profile, data is the same") {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Can't update profile, data is the same" });
          } else {
            // Display a generic error toast
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating profile' });
          }
          console.error('Error updating profile', error);
        }
      });
    this.messageService.clear('confirm');
    this.visible = false;
  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'Error updating profile',
    });
    this.visible = false;
  }



}