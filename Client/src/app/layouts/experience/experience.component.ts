import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';

import { PortfolioDataService } from 'src/app/service/portfolio-data.service';

interface ExperienceInfo {
  exp_id: string;
  exp_text: number;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
  providers: [MessageService],
})
export class ExperienceComponent implements OnInit {
  experience: ExperienceInfo[] = [];
  updateForm: FormGroup;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private portfolioDataService: PortfolioDataService
  ) {
    this.updateForm = this.formBuilder.group({
      exp_id: '',
      exp_text: '',
    });
  }

  ngOnInit(): void {
    this.fetchExperienceData();
  }

  fetchExperienceData(): void {
    this.portfolioDataService.getExperienceData().subscribe({
      next: (res) => {
        this.experience = res.data;
      },
      error: () => {
        this.router.navigate(['/login']);
        console.error('You are not logged in');
        Emitter.authEmitter.emit(false);
      },
    });
  }

  displayAddExperience: boolean = false;
  displayEditExperience: boolean = false;
  confirmEdit: boolean = false;

  AddExperience() {
    this.updateForm.patchValue({
      exp_text: '',
    });
    this.displayAddExperience = true;
  }

  EditExperience(experience: ExperienceInfo) {
    this.updateForm.patchValue({
      exp_id: experience.exp_id,
      exp_text: experience.exp_text,
    });

    this.displayEditExperience = true;
  }

  saveAddExperience(): void {
    const formData = this.updateForm.value;

    this.portfolioDataService
      .saveExperience(formData)
      .pipe(finalize(() => this.displayAddExperience = false))
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Experience created successfully',
          });
          console.log('Experience created successfully:', res);
          this.fetchExperienceData();

          // Clear the form after saving data
          this.updateForm.reset({
            exp_text: '',
          });
        },
        (err) => {
          console.error('Error creating experience:', err);
        }
      );
  }

  saveEditExperience(): void {
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

    this.messageService.clear('confirm1');
    this.portfolioDataService
      .updateExperience(formData)
      .pipe(finalize(() => {
        this.confirmEdit = false;    
      }))
      .subscribe(
        (res) => {
          if(res.success){
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Experience updated successfully',
            });
            console.log('Experience updated successfully:', res);
            this.fetchExperienceData();
            this.displayEditExperience = false;
          }       
        },
        (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Entered experience data is the same as existing data.',
          });
          console.error('Error updating experience:', err);
        }
      );
  }

  onRejectEdit() {
    this.messageService.clear('confirm1');
    this.displayEditExperience = false;
    this.confirmEdit = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected',
    });
  }

  DeleteExperience(experience: ExperienceInfo) {
    this.updateForm.patchValue({
      exp_id: experience.exp_id,
      exp_text: experience.exp_text,
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
    const experienceId = formData.exp_id;

    this.portfolioDataService
      .deleteExperience(experienceId)
      .pipe(finalize(() => this.messageService.clear('confirm')))
      .subscribe(
        (res) => {
          console.log('Experience deleted successfully:', res);
          this.fetchExperienceData();
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Experience deleted successfully',
          });
        },
        (err) => {
          console.error('Error deleting Experience:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete Experience',
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
