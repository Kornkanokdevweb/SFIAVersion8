 import { Component, OnInit } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as html2pdf from 'html2pdf.js'
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

import { PortfolioDataService } from 'src/app/service/portfolio-data.service';

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexXAxis,
  ApexTitleSubtitle,
} from "ng-apexcharts";

type SkillAndLevel = {
  codeSkill: string;
  skillName: string;
  levelName: string;
  description: string[];
  percentage?: number;
};

export type spiderChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

export type dataChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};


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

interface Information {
  info_id: number;
  info_text: string;
  descid: string;
}

interface SelectedInfoItem {
  skillName: string;
  descId: string;
  infoText: string;
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

  allSkillsAndLevels: SkillAndLevel[] = [];
  filteredSkillsAndLevels: SkillAndLevel[] = [];
  selectedSkill: string = '';
  selectedInfo: SelectedInfoItem[] = [];
  

  skill!: string

  images: any;
  selectedImageURL: string | undefined;

  education: EducationInfo[] = [];

  experience: ExperienceInfo[] = [];
  information: Information[] = [];
  updateForm: FormGroup;

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

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
    private portfolioDataService: PortfolioDataService,
    private envEndpointService: EnvEndpointService,
  ) {
    this.chartOptions.series = [
      {
        name: "Percentage",
        data: []
      }
    ];
    this.updateForm = this.formBuilder.group({
      education_id: '',
      syear: '',
      eyear: '',
      level_edu: '',
      universe: '',
      faculty: '',
      branch: '',
      info_id: '',
      info_text: '',
      descid: '',
      exp_id: '',
      exp_text: '',
    });
  }

  public chartOptions: dataChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {
        }
      }
    },
    colors: [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#546E7A",
      "#26a69a",
      "#D10CE8"
    ],
    plotOptions: {
      bar: {
        columnWidth: "50%",
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"]
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: [

      ],
    },
    yaxis: {
      title: {
        text: "DataChart of CodeSkill"
      }
    },
    title: {
      text: "Job-Level",
      offsetY: 336,
      align: "center",
      style: {
        color: "#444",
        fontSize: "12px"
      }
    }
  };

  public spiderChartOptions: spiderChartOptions = {
    series: [
      {
        name: "Percentage",
        data: []
      }
    ],
    chart: {
      height: 250,
      type: "radar"
    },
    xaxis: {
      categories: []
    }
  };

  ngOnInit() {
    this.fetchData();
    this.fetchLinkData();
    this.selectSkill();
    Emitter.authEmitter.emit(true);
  }


  getPercentageSkillAndLevel(codeSkill: string, levelName: string, descIds: string[]): Promise<number> {
    return new Promise((resolve) => {
      this.http.get(`${this.ENV_REST_API}/search?codeskill=${codeSkill}&level_name=${levelName}`, { withCredentials: true })
        .subscribe((data: any) => {
          const selectedLevels = data[0]?.levels.filter((level: any) => level.level_name === levelName);

          if (selectedLevels && selectedLevels.length > 0) {
            const descriptions = selectedLevels.map((level: any) => {
              const descid = level.descriptions[0]?.id || '';
              return { descid };
            });

            const percentage = parseFloat(((descIds.length || 1) / descriptions.length * 100).toFixed(2));

            const skillAndLevel = this.allSkillsAndLevels.find(item => item.codeSkill === codeSkill && item.levelName === levelName) as SkillAndLevel;

            if (skillAndLevel) {
              skillAndLevel.percentage = percentage;
            }

            resolve(percentage);
          } else {
            resolve(0); // Handle the case when selectedLevels is empty
          }
        });
    });
  }

  updateSpiderChartData() {
    this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

    this.spiderChartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage || 0);
    if (this.spiderChartOptions.series[0].data.length < 6) {
      const remainingLength = 6 - this.spiderChartOptions.series[0].data.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.series[0].data.push('0' as any);
      }
    }
    this.spiderChartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
    };
    if (this.spiderChartOptions.xaxis.categories.length < 3) {
      const remainingLength = 6 - this.spiderChartOptions.xaxis.categories.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.xaxis.categories.push('' as any);
      }
    }
  }

  updateChartData() {
    this.allSkillsAndLevels.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    this.chartOptions.series[0].data = this.allSkillsAndLevels.map(item => item.percentage || 0);

    this.chartOptions.xaxis = {
      categories: this.allSkillsAndLevels.map(item => `${item.codeSkill} - ${item.levelName}`)
    };
  }

  fetchSkillDetails(codeSkill: string) {
    this.http
      .get(`${this.ENV_REST_API}/search?codeskill=${codeSkill}`)
      .subscribe(
        (details: any) => {
          const allDescids = (details[0].levels.length);
        }
      )
  }

  fetchData(): void {
    this.http
      .get<any>(`${this.ENV_REST_API}/getExportPortfolio`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.user = res.data.users;
          this.education = res.data.education;
          this.experience = res.data.experience;
        },
        error: () => {
          this.router.navigate(['/login']);
          Emitter.authEmitter.emit(false);
        },
      });
  }

  fetchLinkData(): void {
    this.portfolioDataService.getLinkData().subscribe({
      next: (res: any) => {
        const nameSkill = this.portfolioDataService.getNameSkills();
        this.selectedInfo = res.descriptionsWithLevel
          .filter(info => info.uniqueSkills && info.uniqueSkills.length > 0 && info.uniqueSkills[0].skill_name === nameSkill)
          .map(info => {
            const descId = info.descriptionId;
            const matchingInfo = res.information.find(item => item.description.id === descId);
            return matchingInfo
              ? {
                  skillName: nameSkill,
                  descId,
                  infoText: matchingInfo.info_text
                }
              : null;
          });
      },
      error: () => {
        this.router.navigate(['/login']);
        Emitter.authEmitter.emit(false);
      },
    });
  }
  
  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      this.images = file;
      this.selectedImageURL = URL.createObjectURL(file);
      console.log(this.selectedImageURL)

    } else {
      const fileName = event.target.value
    }
  }

  selectSkill() {
    const nameSkill = this.portfolioDataService.getNameSkills()
    this.allSkillsAndLevels = this.portfolioDataService.getFilteredSkills()
    this.selectedSkill = nameSkill
    this.filterSkills();

    const filteredSkills = this.allSkillsAndLevels.filter(skill => skill.skillName === nameSkill);
    const percentages: number[] = [];
    filteredSkills.forEach(skill => {
      const validPercentage: number = skill.percentage ?? 0;
      percentages.push(validPercentage);
    });


    this.spiderChartOptions.series[0].data = percentages;
    this.spiderChartOptions.xaxis = {
      categories: filteredSkills.map(skill => `${skill.codeSkill} - ${skill.levelName}`)
    };

    this.spiderChartOptions.series[0].data = percentages;
    if (this.spiderChartOptions.series[0].data.length < 6) {
      const remainingLength = 6 - this.spiderChartOptions.series[0].data.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.series[0].data.push('0' as any);
      }
    }

    this.spiderChartOptions.xaxis = {
      categories: filteredSkills.map(skill => `${skill.codeSkill} - ${skill.levelName}`)
    };
    if (this.spiderChartOptions.xaxis.categories.length < 3) {
      const remainingLength = 6 - this.spiderChartOptions.xaxis.categories.length;
      for (let i = 0; i < remainingLength; i++) {
        this.spiderChartOptions.xaxis.categories.push('' as any);
      }
    }

    this.chartOptions.series[0].data = percentages;
    this.chartOptions.xaxis = {
      categories: filteredSkills.map(skill => `${skill.codeSkill} - ${skill.levelName}`)
    };
  }

  filterSkills() {
    if (!this.selectedSkill) {
      this.filteredSkillsAndLevels = this.allSkillsAndLevels;
    } else {
      this.filteredSkillsAndLevels = this.allSkillsAndLevels.filter(skillAndLevel =>
        skillAndLevel.skillName === this.selectedSkill
      );
    }
  }

  handleExport() {
    const options = {
      margin: 0,
      filename: 'Portfolio.pdf',
      image: { type: 'jpeg' },
      html2canvas: { useCORS: true },
      jsPDF: {
        format: 'a4',
        orientation: 'portrait',
      }
    };

    const content = document.getElementById('pdf-content');

    html2pdf()
      .from(content)
      .set(options)
      .save();
  }

  isLink(url: string): boolean {
    return url.includes('://');
  }

  displayPartialURL(fullURL: string, maxLength: number = 35): string {
    const urlParts = fullURL.split('://');
    let displayURL = urlParts[urlParts.length - 1];

    displayURL = displayURL.trim();

    if (displayURL.length > maxLength) {
      return displayURL.substr(0, maxLength) + '...';
    }

    return displayURL.trim() !== '' ? displayURL : fullURL;
  }
}