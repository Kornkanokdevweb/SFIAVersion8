import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class PortfolioComponent implements OnInit {

  ngOnInit(): void {
    Emitter.authEmitter.emit(true)
  }

  }