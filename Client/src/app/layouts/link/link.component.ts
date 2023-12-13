import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { PortfolioDataService } from 'src/app/service/portfolio-data.service';

const API_URL = 'http://localhost:8080/api';

interface Information {
  info_id: number;
  info_text: string;
  descid: string;
}

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
  providers: [MessageService],
})
export class LinkComponent implements OnInit {
  information: Information[] = [];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private portfolioDataService: PortfolioDataService
  ) {
  }

  ngOnInit(): void {
    this.fetchLinkData();
    this.primengConfig.ripple = true;
  }

  currentPage: number = 1;
  pageSize: number = 5;

  fetchLinkData(): void {
    this.portfolioDataService.getLinkData().subscribe({
      next: (res: any) => {
        console.log(res)
        this.information = res.information.map((info: any) => ({
          info_text: info.info_text,
        }));
      },
      error: () => {
        this.router.navigate(['/login']);
        console.error('You are not logged in');
        Emitter.authEmitter.emit(false);
      },
    });
  }

  isLink(url: string): boolean {
    return url.includes('://');
  }

  displayPartialURL(fullURL: string, maxLength: number = 35): string {
    const urlParts = fullURL.split('://');
    let displayURL = urlParts[urlParts.length - 1];

    // Remove trailing spaces
    displayURL = displayURL.trim();

    // Check if the displayURL is longer than the specified maxLength
    if (displayURL.length > maxLength) {
      return displayURL.substr(0, maxLength) + '...';
    }

    // Check if displayURL is not empty or just spaces
    return displayURL.trim() !== '' ? displayURL : fullURL;
  }

}