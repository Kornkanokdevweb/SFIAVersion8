import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-standard',
  templateUrl: './detail-standard.component.html',
  styleUrls: ['./detail-standard.component.css'],
  providers: [ConfirmationService, MessageService],
})

export class DetailStandardComponent implements OnInit {

  codeskill!: number;
  skillDetails: any;
  visible: boolean = false;
  selectedMetal: string | null = null;
  
  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private http: HttpClient
  ){ }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.codeskill = params['codeskill']; // Get the skill code from route parameters
      this.fetchSkillDetails();

      Emitter.authEmitter.emit(true);
    });
  }

  showDialog() {
    this.visible = true;
  }

  showDetails(metal: string) {
    this.selectedMetal = metal;
  }

  closeAddLink() {
    this.visible = false;
  }

  saveAddLink() {
    // ทำการบันทึกข้อมูลที่แก้ไข
    
    // เมื่อบันทึกเสร็จแล้วให้ปิดหน้าต่าง
    this.closeAddLink();
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add data successfully' });
  }

  fetchSkillDetails() {
    this.http.get(`http://localhost:8080/api/search?codeskill=${this.codeskill}`)
      .subscribe(
        (details: any) => { // ระบุชนิดข้อมูลที่คาดหวัง
          this.skillDetails = details;
        },
        (error) => {
          console.error('Error fetching skill details:', error);
        }
      );
  }
  

}