import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

import { PortfolioDataService } from 'src/app/service/portfolio-data.service';

interface EducationInfo {
  education_id: string;
  syear: number;
  eyear: number;
  level_edu: string;
  universe: string;
  faculty: string;
  branch: string;
}

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  providers: [MessageService],
})
export class EducationComponent implements OnInit {
  education: EducationInfo[] = [];
  updateForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private portfolioDataService: PortfolioDataService
  ) {
    this.updateForm = this.formBuilder.group({
      education_id: '',
      syear: ['', Validators.required],
      eyear: ['', Validators.required],
      level_edu: '',
      universe: '',
      faculty: '',
      branch: '',
    }, { validators: this.yearRangeValidator });
  }

  ngOnInit(): void {
    this.fetchEducationData();
    this.primengConfig.ripple = true;
  }

  yearRangeValidator: ValidatorFn = (control: AbstractControl) => {
    const startYear = control.get('syear')?.value;
    const endYear = control.get('eyear')?.value;

    if (startYear !== null && endYear !== null && startYear >= endYear) {
      return { yearRange: true };
    }

    return null;
  };

  fetchEducationData(): void {
    this.portfolioDataService.getEducationData().subscribe({
      next: (res) => {
        this.education = res.data;
      },
      error: () => {
        this.router.navigate(['/login']);
        console.error('You are not logged in');
        Emitter.authEmitter.emit(false);
      },
    });
  }

  displayAddEducation: boolean = false;
  displayEditEducation: boolean = false;
  confirmEdit: boolean = false;

  AddEducation() {
    this.updateForm.patchValue({
      syear: '',
      eyear: '',
      level_edu: '',
      universe: '',
      faculty: '',
      branch: '',
    });
    this.displayAddEducation = true;
  }

  EditEducation(education: EducationInfo): void {
    this.updateForm.patchValue({
      education_id: education.education_id,
      syear: education.syear,
      eyear: education.eyear,
      level_edu: education.level_edu,
      universe: education.universe,
      faculty: education.faculty,
      branch: education.branch,
    });
    console.log(this.EditEducation);

    this.displayEditEducation = true;
  }

  saveAddEducation(): void {
    const formData = this.updateForm.value;
    if (formData.syear >= formData.eyear) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Start Year must be less than End Year',
      });
      return;
    }
  
    this.portfolioDataService.saveEducation(formData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Education created successfully',
        });
        console.log('Education created successfully:', res);
        this.fetchEducationData();
        this.displayAddEducation = false;

        this.updateForm.reset({
          syear: '',
          eyear: '',
          level_edu: '',
          universe: '',
          faculty: '',
          branch: '',
        });
      },
      error: (err) => {
        console.error('Error creating education:', err);
      },
    });
  }

  saveEditEducation(): void {
    if (!this.confirmEdit) {
      this.messageService.add({
        key: 'confirm1',
        sticky: true,
        severity: 'warn',
        summary: 'Are you sure?',
        detail: 'Are you sure you want to proceed?',
      });
      this.confirmEdit = true;
    }
  }

  onConfirmEdit() {

    const formData = this.updateForm.value;
    if (formData.syear >= formData.eyear) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Start Year must be less than End Year',
      });
      return;
    }

    this.messageService.clear('confirm1');
    this.portfolioDataService
      .updateEducation(formData)
      .pipe(finalize(() => (
        this.confirmEdit = false)))
      .subscribe(
        (res) => {
          if (res.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Education updated successfully',
            });
            console.log('Education updated successfully:', res);
            this.fetchEducationData();
            this.displayEditEducation = false;
          } else {
          }
        },
        (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Entered education data is the same as existing data.',
          });
          console.error('Error updating education:', err);
        }
      );
  }

  onRejectEdit() {
    this.messageService.clear('confirm1');
    this.displayEditEducation = false;
    this.confirmEdit = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected',
    });
  }

  DeleteEducation(education: EducationInfo) {
    this.updateForm.patchValue({
      education_id: education.education_id,
      syear: education.syear,
      eyear: education.eyear,
      level_edu: education.level_edu,
      universe: education.universe,
      faculty: education.faculty,
      branch: education.branch,
    });
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmation',
      detail: 'Are you sure you want to proceed?',
    });
  }

  onConfirm() {
    const formData = this.updateForm.value;
    const educationId = formData.education_id;

    this.portfolioDataService
      .deleteEducation(educationId)
      .pipe(finalize(() => this.messageService.clear('confirm')))
      .subscribe(
        (res) => {
          console.log('Education deleted successfully:', res);
          this.fetchEducationData();
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Education deleted successfully',
          });
        },
        (err) => {
          console.error('Error deleting education:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete education',
          });
        }
      );
  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected',
    });
  }
}
