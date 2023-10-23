import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as html2pdf from 'html2pdf.js'

const API_URL = 'http://localhost:8080/api';

interface UserProfile {
  profileImage: string;
  email: string;
  line: string;
  firstNameTH: string;
  lastNameTH: string;
  firstNameEN: string;
  lastNameEN: string;
  phone: string;
  address: string;
}

interface EducationInfo {
  education_id: string;
  syear: number;
  eyear: number;
  level_edu: string;
  universe: string;
  faculty: string;
  branch: string;
}

interface LinkInfo {
  link_id: string;
  link_name: string;
  link_text: string;
}

interface ExperienceInfo {
  exp_id: string;
  exp_text: number;
}

@Component({
  selector: 'app-portfolio-information',
  templateUrl: './portfolio-information.component.html',
  styleUrls: ['./portfolio-information.component.css'],
})

export class PortfolioInformationComponent implements OnInit {

  images: any;
  selectedImageURL: string | undefined;

  education: EducationInfo[] = [];
  link: LinkInfo[] = [];
  experience: ExperienceInfo[] = [];
  updateForm: FormGroup;

  user: UserProfile = {
    profileImage: '',
    email: '',
    line: '',
    firstNameTH: '',
    lastNameTH: '',
    firstNameEN: '',
    lastNameEN: '',
    phone: '',
    address: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {
    this.updateForm = this.formBuilder.group({
      education_id: '',
      syear: '',
      eyear: '',
      level_edu: '',
      universe: '',
      faculty: '',
      branch: '',
      link_id: '',
      link_name: '',
      link_text: '',
      exp_id: '',
      exp_text: '',
    });
  }

  ngOnInit() {
    this.fetchData();
    Emitter.authEmitter.emit(true);
  }

  fetchData(): void {
    this.http
      .get<any>(`${API_URL}/getExportPortfolio`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          console.log(res);

          this.user = res.data.users;
          this.education = res.data.education;
          this.link = res.data.link;
          this.experience = res.data.experience;
        },
        error: () => {
          this.router.navigate(['/login']);
          console.error('You are not logged in');
          Emitter.authEmitter.emit(false);
        },
      });
  }

  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      console.log(file);
      this.images = file;
      this.selectedImageURL = URL.createObjectURL(file);
      console.log(this.selectedImageURL)

    } else {
      const fileName = event.target.value
      console.log(fileName)
    }
  }

  exportToPDF() {
    const options = {
      margin: 1,
      filename: 'Portfolio.pdf',
      image: { type: 'jpeg' },
      html2canvas: { useCORS: true },
      jsPDF: {
        format: 'a4',
        orientation: 'portrait'
      }
    };

    const content = document.getElementById('pdf-content');

    html2pdf()
      .from(content)
      .set(options)
      .save();
  }

}