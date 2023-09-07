import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitter } from 'src/app/emitters/emitter';
import { Router } from '@angular/router';

interface Category {
  category_text: string;
}

interface Subcategory {
  subcategory_text: string;
}

interface Skills {
  id: number;
  skill_name: string;
  overall: string;
  category: Category;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {


  message = ''

  searchSkill: string = '';
  searchResults: Skills[] = [];
  isInvalidInput: boolean = false;
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  categories: string[] = [];
  subcategories: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/api/user')
      .subscribe({
        next: (res: any) => {
          this.message = `Hi ${res.id}`
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          //handle error
          this.router.navigate(['/'])
          console.log(`You are not logged in`)
          Emitter.authEmitter.emit(false)
        }
      });
    this.fetchSkills();
    this.fetchCategories();
  }

 //defaut ข้อมูลทั้งหมด
 fetchSkills() {
  this.http.get<Skills[]>('http://localhost:8080/api/search').subscribe(
    (skills) => {
      this.searchResults = skills;
    },
    (error) => {
      console.error('Error fetching skills:', error);
    }
  );
}

//ค้นหาข้อมูลจากการกรอก InputText
searchSkills() {
  const validInputPattern = /^[a-zA-Z\u0E00-\u0E7F\s]*$/;
  this.isInvalidInput = !validInputPattern.test(this.searchSkill);

  if (!this.isInvalidInput) {
    this.http.get<Skills[]>('http://localhost:8080/api/search').subscribe(
      (skills) => {
        this.searchResults = skills.filter((result) =>
          result.skill_name && result.skill_name.toLowerCase().includes(this.searchSkill.toLowerCase())
        );
      },
      (error) => {
        console.error('Error fetching skills:', error);
      }
    );
  }
}

//การแสดงข้อมูลใน dropdown category
fetchCategories() {
  this.http.get<any>('http://localhost:8080/api/category').subscribe((response) => {
    const allCategories = response.skills.map((skill: any) => skill.category.category_text);
    this.categories = this.removeDuplicates(allCategories);
  });
}

//เมื่อมีการเลือก dropdown category 
onCategoryChange() {
  if (this.selectedCategory) {
    this.http.get<any>('http://localhost:8080/api/category?categoryText=' + this.selectedCategory)
      .subscribe((response) => {
        const allSubcategories = response.subcategoryTexts;
        this.subcategories = this.removeDuplicates(allSubcategories);
      });
  } else {
    this.subcategories = [];
  }
}

//เมื่อมีการเลือก dropdown subcategory ให้ทำการ fetch ข้อมูลด้วย
onSubcategoryChange() {
  if (this.selectedSubcategory) {
    const apiUrl = `http://localhost:8080/api/category?categoryText=${this.selectedCategory}&subcategoryText=${this.selectedSubcategory}`;

    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        this.searchResults = response.skills;
        console.log(response.skills);
      },
      (error) => {
        console.error('Error fetching skills:', error);
      }
    );
  } else {
    this.fetchSkills();
  }
}

//ฟังก์ชันสำหรับการลบข้อมูลใน dropdown ที่ซ้ำกัน
removeDuplicates(items: string[]): string[] {
  const uniqueItems = [];
  const seenItems = new Set();

  for (const item of items) {
    if (!seenItems.has(item)) {
      seenItems.add(item);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}

}