import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Emitter } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-portfolio-information',
  templateUrl: './portfolio-information.component.html',
  styleUrls: ['./portfolio-information.component.css'],
})

export class PortfolioInformationComponent implements OnInit{
  ngOnInit() {
    Emitter.authEmitter.emit(true);
  }
  
  exportToPDF() {
    const content = document.getElementById('pdf-content'); 

    if (content) {
      html2canvas(content).then((canvas) => {
        // Create a new PDF document
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculate the aspect ratio for the PDF page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const aspectRatio = imgWidth / imgHeight;

        // Calculate the height needed for the image to fit within the page width
        const scaledHeight = pdfWidth / aspectRatio;

        // Add the captured image to the PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, scaledHeight);

        // Save or open the PDF
        pdf.save('portfolio.pdf');
      });
    }
  }
}
