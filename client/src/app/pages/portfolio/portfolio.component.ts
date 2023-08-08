import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [MessageService]
})
export class PortfolioComponent  {
  cities: City[] | undefined;

    selectedJob: City | undefined;

    // fix it
    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];
    }

    constructor(private messageService: MessageService) {}

    showExport() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Export Portfolio successfully' });
    }

    showAdd() {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Add data successfully' });
  }
}
