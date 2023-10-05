import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { Emitter } from 'src/app/emitters/emitter';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit{
  constructor(
    private http: HttpClient,
  ) { }

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
