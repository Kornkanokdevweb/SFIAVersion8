import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class PortfolioComponent implements OnInit {
  ngOnInit() {
    Emitter.authEmitter.emit(true)
  }

  constructor(
    private messageService: MessageService,
    public dialog: MatDialog) { }

  displayAddExperience: boolean = false;
  displayEditExperience: boolean = false;
  displayAddLink: boolean = false;
  displayEditLink: boolean = false;



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
