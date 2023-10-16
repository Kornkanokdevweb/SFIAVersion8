import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  constructor(
    private messageService: MessageService,
    public dialog: MatDialog) { }

    
  }

  
