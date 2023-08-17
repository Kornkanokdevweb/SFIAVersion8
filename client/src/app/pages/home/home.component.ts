import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Emitter } from 'src/app/emitters/emitter';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message = ''

  constructor(
    private http: HttpClient,
    // private router: Router
  ){

  }
  
  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/user')
      .subscribe({
        next: (res: any) => {
          console.log(res)
          this.message = `Hi ${res.id}`
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          //handle error
          // this.router.navigate(['/login'])
          console.log(`You are not logged in`)
          Emitter.authEmitter.emit(false)
        }
      });
  }
  
}