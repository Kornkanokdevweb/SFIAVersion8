import { Component } from '@angular/core';

@Component({
  selector: 'app-detail-standard',
  templateUrl: './detail-standard.component.html',
  styleUrls: ['./detail-standard.component.css']
})
export class DetailStandardComponent {
  visible: boolean = false;

      showDialog() {
          this.visible = true;
      }
}
