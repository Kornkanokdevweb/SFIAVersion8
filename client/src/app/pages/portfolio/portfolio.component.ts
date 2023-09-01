import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class PortfolioComponent implements OnInit {
  ngOnInit() {

  }

  constructor(private messageService: MessageService,
    public dialog: MatDialog) { }

  showExport() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Export Portfolio successfully' });
  }

  showAdd() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add data successfully' });
  }

  displayAddEducation: boolean = false;
  displayEditEducation: boolean = false;
  displayAddExperience: boolean = false;
  displayEditExperience: boolean = false;
  displayAddLink: boolean = false;
  displayEditLink: boolean = false;

  showAddEducation() {
    this.displayAddEducation = true;
  }

  showEditEducation() {
    this.displayEditEducation = true;
  }

  showAddExperience() {
    this.displayAddExperience = true;
  }

  showEditExperience() {
    this.displayEditExperience = true;
  }

  showAddLink() {
    this.displayAddLink = true;
  }

  showEditLink() {
    this.displayEditLink = true;
  }

  date: Date[] | undefined;



  closeAddEducation() {
    this.displayAddEducation = false;
  }

  saveAddEducation() {
    // ทำการบันทึกข้อมูลที่แก้ไข
    // ตัวอย่างเช่น: this.editedExperience.save();

    // เมื่อบันทึกเสร็จแล้วให้ปิดหน้าต่าง
    this.closeAddEducation();
  }

  closeEditEducation() {
    this.displayEditEducation = false;
  }

  saveEditEducation() {
    // ทำการบันทึกข้อมูลที่แก้ไข
    // ตัวอย่างเช่น: this.editedExperience.save();

    // เมื่อบันทึกเสร็จแล้วให้ปิดหน้าต่าง
    this.closeEditEducation();
  }

  closeAddExperience() {
    this.displayAddExperience = false;
  }

  saveAddExperience() {
    // ทำการบันทึกข้อมูลที่แก้ไข
    // ตัวอย่างเช่น: this.editedExperience.save();

    // เมื่อบันทึกเสร็จแล้วให้ปิดหน้าต่าง
    this.closeAddExperience();
  }

  closeEditExperience() {
    this.displayEditExperience = false;
  }

  saveEditExperience() {
    // ทำการบันทึกข้อมูลที่แก้ไข
    // ตัวอย่างเช่น: this.editedExperience.save();

    // เมื่อบันทึกเสร็จแล้วให้ปิดหน้าต่าง
    this.closeEditExperience();
  }

  closeAddLink() {
    this.displayAddLink = false;
  }

  saveAddLink() {
    // ทำการบันทึกข้อมูลที่แก้ไข
    // ตัวอย่างเช่น: this.editedExperience.save();

    // เมื่อบันทึกเสร็จแล้วให้ปิดหน้าต่าง
    this.closeAddLink();
  }

  closeEditLink() {
    this.displayEditLink = false;
  }

  saveEditLink() {
    // ทำการบันทึกข้อมูลที่แก้ไข
    // ตัวอย่างเช่น: this.editedExperience.save();

    // เมื่อบันทึกเสร็จแล้วให้ปิดหน้าต่าง
    this.closeEditLink();
  }


}
