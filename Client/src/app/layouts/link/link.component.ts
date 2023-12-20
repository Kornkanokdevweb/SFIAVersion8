import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Emitter } from 'src/app/emitters/emitter';
import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { PortfolioDataService } from 'src/app/service/portfolio-data.service';

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
    private primengConfig: PrimeNGConfig,
    private portfolioDataService: PortfolioDataService
  ) {}

  ngOnInit(): void {
    this.fetchLinkData();
    this.primengConfig.ripple = true;
  }

  currentPage: number = 1;
  pageSize: number = 5;

  fetchLinkData(): void {
    this.portfolioDataService.getLinkData().subscribe({
      next: (res: any) => {
        this.information = res.information.map((info: any) => ({
          info_text: info.info_text,
        }));
      },
      error: () => {
        this.router.navigate(['/login']);
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

    displayURL = displayURL.trim();

    if (displayURL.length > maxLength) {
      return displayURL.substr(0, maxLength) + '...';
    }

    return displayURL.trim() !== '' ? displayURL : fullURL;
  }
}