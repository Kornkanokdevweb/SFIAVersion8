import { Component} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail-standard',
  templateUrl: './detail-standard.component.html',
  styleUrls: ['./detail-standard.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class DetailStandardComponent {

  constructor(private messageService: MessageService){ }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  selectedMetal: string | null = null;

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

}
