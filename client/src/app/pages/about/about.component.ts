import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitter } from 'src/app/emitters/emitter'; 
import * as AOS from 'aos'


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(
    private http: HttpClient,
  ) { }
  
  ngOnInit(): void {
    AOS.init()
    window.addEventListener('load',AOS.refresh)
    this.http.get('http://localhost:8080/api/user')
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          console.log(`You are not logged in`)
          Emitter.authEmitter.emit(false)
        }
      });
  }
}
