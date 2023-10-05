import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitter } from 'src/app/emitters/emitter';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  first: number = 0;

  rows: number = 10;

  onPageChange(event: PageEvent) {
      this.first = event.first;
      this.rows = event.rows;
  }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/user', {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true)
          AuthInterceptor.accessToken
        },
        error: () => {
          Emitter.authEmitter.emit(false)
        }
      });
  }

}