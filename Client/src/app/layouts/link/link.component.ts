import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { PortfolioDataService } from 'src/app/service/portfolio-data.service';

const API_URL = 'http://localhost:8080/api';

interface LinkInfo {
  link_id: string;
  link_name: string;
  link_text: string;
}

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  providers: [MessageService],
})
export class LinkComponent implements OnInit {
  link: LinkInfo[] = [];
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
      link_id: '',
      link_name: '',
      link_text: ['', [Validators.required, Validators.pattern('^(https?|ftp):\\/\\/(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+(\\/[^\\s]*)?$')]],
    });
  }

  ngOnInit(): void {
    this.fetchLinkData();
    this.primengConfig.ripple = true;
  }

  fetchLinkData(): void {
    this.portfolioDataService.getLinkData().subscribe({
      next: (res) => {
        this.link = res.data;
      },
      error: () => {
        this.router.navigate(['/login']);
        console.error('You are not logged in');
        Emitter.authEmitter.emit(false);
      },
    });
  }

  displayAddLink: boolean = false;
  displayEditLink: boolean = false;
  confirmEdit: boolean = false;

  AddLink() {
    this.updateForm.patchValue({
      link_name: '',
      link_text: '',
    });
    this.displayAddLink = true;
  }

  EditLink(link: LinkInfo): void {
    this.updateForm.patchValue({
      link_id: link.link_id,
      link_name: link.link_name,
      link_text: link.link_text,
    });
    console.log(this.EditLink);

    this.displayEditLink = true;
  }

  saveAddLink(): void {
    const formData = this.updateForm.value;

    this.portfolioDataService
      .saveLink(formData)
      .pipe(finalize(() => this.displayAddLink = false))
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Link created successfully',
          });
          console.log('Link created successfully:', res);
          this.fetchLinkData();

          // Clear the form after saving data
          this.updateForm.reset({
            link_name: '',
            link_text: '',
          });
        },
        (err) => {
          console.error('Error creating link:', err);
        }
      );
  }

  saveEditLink(): void {
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
      .updateLink(formData)
      .pipe(finalize(() => (
        this.confirmEdit = false)))
      .subscribe(
        (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Link updated successfully',
          });
          console.log('Link updated successfully:', res);
          this.fetchLinkData();
          this.displayEditLink = false;
        },
        (err) => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Entered education data is the same as existing data.',
          });
          console.error('Error updating link:', err);
        }
      );
  }

  onRejectEdit() {
    this.messageService.clear('confirm1');
    this.displayEditLink = false;
    this.confirmEdit = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'You have rejected',
    });
  }

  DeleteLink(link: LinkInfo) {
    this.updateForm.patchValue({
      link_id: link.link_id,
      link_name: link.link_name,
      link_text: link.link_text,
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
    const linkId = formData.link_id;

    this.portfolioDataService
      .deleteLink(linkId)
      .pipe(finalize(() => this.messageService.clear('confirm')))
      .subscribe(
        (res) => {
          console.log('Link deleted successfully:', res);
          this.fetchLinkData();
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Link deleted successfully',
          });
        },
        (err) => {
          console.error('Error deleting link:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete link',
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

  isLink(url: string): boolean {
    return url.includes('://');
  }

  displayPartialURL(fullURL: string, maxLength: number = 20): string {
    const urlParts = fullURL.split('/');
    let displayURL = urlParts[urlParts.length - 1];

    // Remove trailing spaces
    displayURL = displayURL.trim();

    // Check if the displayURL is longer than the specified maxLength
    if (displayURL.length > maxLength) {
      return displayURL.substr(0, maxLength) + '...';
    }

    // Check if displayURL is not empty or just spaces
    return displayURL.trim() !== '' ? displayURL : fullURL;
  }

}