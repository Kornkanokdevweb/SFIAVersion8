import { Component,OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { HttpClient } from '@angular/common/http';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

@Component({
  selector: 'app-quick-sidebar',
  templateUrl: './quick-sidebar.component.html',
  styleUrls: ['./quick-sidebar.component.css']
})
export class QuickSidebarComponent implements OnInit {

  authenticated = false;
  showSidebar = true;
  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

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

  logOut() {
    this.http
      .post(`${this.ENV_REST_API}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        AuthInterceptor.accessToken = '';
        this.router.navigate(['/login']);
        Emitter.authEmitter.emit(false);
      });
  }
}