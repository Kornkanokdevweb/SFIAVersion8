import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import * as AOS from 'aos'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SFIAV8';
  hideNavbarAndFooter = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    initFlowbite();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideNavbarAndFooter = event.url === '/portfolio-information';
      }
    });
  }

  ngOnInit(){
    AOS.init()
    window.addEventListener('load',AOS.refresh)
  }
}