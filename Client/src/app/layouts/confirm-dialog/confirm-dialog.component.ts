import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ConfirmDialogComponent {
  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}
  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  showConfirm() {
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmation',
      detail: 'Are you sure you want to proceed?',
    });
  }

  onConfirm() {
    this.messageService.add({
      severity: 'success',
      summary: 'Confirmed',
      detail: 'You have accepted',
    });
    this.messageService.clear('confirm');
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