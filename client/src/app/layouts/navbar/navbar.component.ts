import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Emitter } from 'src/app/emitters/emitter';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`
  authenticated = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private envEndpointService: EnvEndpointService,
    ) {}

  ngOnInit(): void {
    Emitter.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  reloadPage() {
    if (this.router.url === '/') {
      window.location.reload();
    }
  }
}