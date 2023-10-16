import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import * as html2pdf from 'html2pdf.js'

@Component({
  selector: 'app-portfolio-information',
  templateUrl: './portfolio-information.component.html',
  styleUrls: ['./portfolio-information.component.css'],
})

export class PortfolioInformationComponent implements OnInit {
  ngOnInit() {
    Emitter.authEmitter.emit(true);
  }

  exportToPDF() {
    const options = {
      margin: 0,
      filename: 'Portfolio.pdf',
      html2canvas: {},
      jsPDF: { 
        format: 'a4',
        orientation: 'portrait'
      }
    };

    const content = document.getElementById('pdf-content');

    html2pdf()
      .from(content)
      .set(options)
      .save();
  }

}
