import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitter } from 'src/app/emitters/emitter';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  message = ''
  
  searchSkill: string = '';
  searchResults: any[] = [];
  originalData: any[] = [
    { id: 1, name: 'John Doe', age: 30, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 28, city: 'Los Angeles' },
    { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
    { id: 4, name: 'Alice Williams', age: 32, city: 'Houston' }
  ];

  constructor(
    private http: HttpClient,
  ){}

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

  search() {
    // ดำเนินการค้นหาและรับผลลัพธ์
    this.searchResults = this.originalData.filter(result =>
      result.name.toLowerCase().includes(this.searchSkill.toLowerCase())
    );
  }
  
  
  
}
