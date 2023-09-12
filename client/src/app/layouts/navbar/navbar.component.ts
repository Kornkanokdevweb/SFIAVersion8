import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { Emitter } from 'src/app/emitters/emitter';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;

  authenticated = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    Emitter.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
    this.items = [
      { label: 'Profile', icon: 'pi pi-fw pi-user', routerLink: '/profile' },
      { label: 'History', icon: 'pi pi-fw pi-trash', routerLink: '/history' },
      {
        label: 'Portfolio',
        icon: 'pi pi-fw pi-book',
        routerLink: '/portfolio',
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logOut(),
      },
    ];
  }

  logOut() {
    this.http
      .post('http://localhost:8080/api/logout', {}, { withCredentials: true })
      .subscribe(() => {
        AuthInterceptor.accessToken = '';
        this.router.navigate(['/login']);
        Emitter.authEmitter.emit(false);
      });
  }

  reloadPage() {
    if (this.router.url === '/') {
      window.location.reload();
    }
  }
}
