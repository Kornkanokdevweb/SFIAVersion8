import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  searchSkill: string = '';
  searchResults: any[] = [];
  originalData: any[] = [
    { id: 1, name: 'John Doe', age: 30, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 28, city: 'Los Angeles' },
    { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
    { id: 4, name: 'Alice Williams', age: 32, city: 'Houston' }
  ];

  constructor(){}

  ngOnInit(): void {
    
  }

  search() {
    // ดำเนินการค้นหาและรับผลลัพธ์
    this.searchResults = this.originalData.filter(result =>
      result.name.toLowerCase().includes(this.searchSkill.toLowerCase())
    );
  }
  
  
  
}
