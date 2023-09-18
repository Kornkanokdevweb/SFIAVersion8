import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

const API_URL = 'http://localhost:8080/api';


@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {

  constructor(
    public dialog: MatDialog) { }

  displayAddEducation: boolean = false;
  displayEditEducation: boolean = false;

  showAddEducation() {
    this.displayAddEducation = true;
  }

  showEditEducation() {
    this.displayEditEducation = true;
  }

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
}
