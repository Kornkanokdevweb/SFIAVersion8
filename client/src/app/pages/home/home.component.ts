import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitter } from 'src/app/emitters/emitter';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { debounceTime } from 'rxjs/operators';


interface Category {
  category_text: string;
}

interface Subcategory {
  subcategory_text: string;
}

interface Skills {
  codeskill: number;
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

  currentPage: number = 1;
  pageSize: number = 8;

  isLoggedIn: boolean = false;

  searchSkill: string = '';
  searchResults: Skills[] = [];
  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  categories: string[] = [];
  subcategories: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.checkLogin()
    this.fetchSkills();

    this.selectedCategory = 'all';
    this.selectedSubcategory = 'all';
    this.fetchCategories();


  }

  checkLogin() {
    this.http.get('http://localhost:8080/api/user', { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          AuthInterceptor.accessToken
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          //handle error
          this.router.navigate(['/'])
          Emitter.authEmitter.emit(false)
        }
      });
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
    this.http
      .get<Skills[]>('http://localhost:8080/api/search')
      .pipe(debounceTime(300))
      .subscribe(
        (skills) => {
          this.searchResults = skills.filter(
            (result) =>
              result.skill_name &&
              result.skill_name.toLowerCase().includes(this.searchSkill.toLowerCase())
          );
        },
        (error) => {
          console.error('Error fetching skills:', error);
        }
      );

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
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      this.http.get<any>('http://localhost:8080/api/category?categoryText=' + this.selectedCategory)
        .subscribe((response) => {
          const allSubcategories = response.subcategoryTexts;
          this.subcategories = this.removeDuplicates(allSubcategories);

          if (this.selectedCategory) {
            this.fetchSkillsForCategory(this.selectedCategory);
          }

          this.selectedSubcategory = 'all';

          if (this.subcategories.length > 0) {
            this.onSubcategoryChange();
          }
        });
    } else {
      this.fetchSkillsForCategory('all');
      this.selectedSubcategory = 'all';
    }
  }

  fetchSkillsForCategory(category: string | null) {
    if (category === 'all') {
      this.fetchSkills();
      return;
    }
    this.http.get<any>(`http://localhost:8080/api/category?categoryText=${category}`).subscribe(
      (response) => {
        this.searchResults = response.skills;
      },
      (error) => {
        console.error('Error fetching skills:', error);
      }
    );
    this.currentPage = 1;
  }

  onSubcategoryChange() {
    if (this.selectedSubcategory && this.selectedSubcategory !== 'all') {
      const apiUrl = `http://localhost:8080/api/category?categoryText=${this.selectedCategory}&subcategoryText=${this.selectedSubcategory}`;

      this.http.get<any>(apiUrl).subscribe(
        (response) => {
          this.searchResults = response.skills;
        },
        (error) => {
          console.error('Error fetching skills:', error);
        }
      );
    } else {
      if (this.selectedCategory) {
        this.fetchSkillsForCategory(this.selectedCategory);
      }
    }
    this.currentPage = 1;
  }

  //ฟังก์ชันสำหรับการลบข้อมูลใน dropdown ที่ซ้ำกัน
  removeDuplicates(items: string[]): string[] {
    const uniqueItems: string[] = [];
    const seenItems = new Set();
    for (const item of items) {
      if (!seenItems.has(item)) {
        seenItems.add(item);
        uniqueItems.push(item);
      }
    }
    return uniqueItems;
  }

  viewSkillDetail(codeskill: number) {
    this.router.navigate(['/detail-standard', codeskill]);
  }
}