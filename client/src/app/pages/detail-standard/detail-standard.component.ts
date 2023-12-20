import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
import { Title } from '@angular/platform-browser';

interface Information {
  info_id: number;
  info_text: string;
  descid: string;
}

@Component({
  selector: 'app-detail-standard',
  templateUrl: './detail-standard.component.html',
  styleUrls: ['./detail-standard.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class DetailStandardComponent implements OnInit {
  updateInfoText: string | null = null;

  codeskill!: number;
  levelNames: string[] = [];
  skillDetails: any;

  selectedMetal: string | null = null;
  selectedLevelDescriptions: { description_text: string; descid: string }[] =
    [];
  selectedDescriptionIndex: number | null = null;

  descid: string[] = [];

  visible: boolean[] = [];
  percentage!: number;

  isLoggedIn: boolean = false;

  information: Information[] = [];
  updateForm: FormGroup;

  percentageMap: Map<string, number> = new Map(); // สร้าง Map เพื่อเก็บ percentageForLevel

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private envEndpointService: EnvEndpointService,
    private titleService: Title
  ) {
    this.updateForm = this.formBuilder.group({
      info_id: '',
      info_text: ['', [Validators.required, Validators.pattern('^(https?|ftp):\\/\\/(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+(\\/[^\\s]*)?$')]],
      descid: '',
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | Detail');
    this.route.params.subscribe((params) => {
      this.codeskill = params['codeskill']; // Get the skill code from route parameters
      this.fetchSkillDetails();
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    this.http.get(`${this.ENV_REST_API}/user`).subscribe({
      next: (res: any) => {
        Emitter.authEmitter.emit(true);
        this.isLoggedIn = true;
      },
      error: () => {
        this.isLoggedIn = false;
      },
    });
  }

  fetchSkillDetails() {
    let temporarySkillDetails: any[] = [];
    this.http
      .get(`${this.ENV_REST_API}/search?codeskill=${this.codeskill}`)
      .subscribe(
        (details: any) => {
          const levelNameMap = new Map<string, number[]>();

          details[0].levels.forEach((level: any) => {
            const levelName = level.level_name;
            const id = level.id;

            if (!levelNameMap.has(levelName)) {
              levelNameMap.set(levelName, [id]);
            } else {
              levelNameMap.get(levelName)?.push(id);
            }
          });

          let descids: string[] = [];
          let levelNameList: string[] = [];
          let descLengthMap: Map<string, number> = new Map();

          this.skillDetails = Array.from(levelNameMap).map(
            ([level_name, ids]) => {
              const desc = ids.map((id) => `desc${id}`);
              descids = descids.concat(desc);
              levelNameList.push(level_name);

              const description = {
                desc: ids.map((id) => `desc${id}`),
              };

              const descLength = description.desc.length;
              descLengthMap.set(level_name, descLength); // บันทึก descLength ลงใน Map

              const levelName = level_name;

              return {
                level_name: level_name,
                description: {
                  desc: ids.map((id) => `desc${id}`),
                },
              };
            }
          );

          temporarySkillDetails = this.skillDetails;

          this.http
            .get(`${this.ENV_REST_API}/getDatacollection`, {
              withCredentials: true,
            })
            .subscribe(
              (data: any) => {
                // กรองข้อมูล info_text โดยใช้ descids
                this.information = data.information
                  .filter((info: { description: { id: string } }) =>
                    descids.includes(info.description.id.toString())
                  )
                  .map((info: any) => {
                    const info_id = info.id;
                    const info_text = info.info_text;
                    const descid = info.description.id.toString();

                    return { info_id, info_text, descid };
                  });
                
                this.information.sort((a, b) =>
                  a.descid.localeCompare(b.descid)
                );
                const descIdsWithInformation = this.information.map(
                  (info) => info.descid
                );
                levelNameList.forEach((levelName) => {
                  const levelDetails = temporarySkillDetails.find(
                    (detail) => detail.level_name === levelName
                  );
                  
                  if (levelDetails) {
                    const descIdsForLevel = levelDetails.description.desc;
                    const descIdsWithInformationForLevel =
                      descIdsWithInformation.filter((descid) =>
                        descIdsForLevel.includes(descid)
                      );
                    const percentageForLevel = parseFloat(((descIdsWithInformationForLevel.length / descIdsForLevel.length) * 100).toFixed(2));
                    this.percentageMap.set(levelName, percentageForLevel);
                  }
                });

                this.percentage = (descIdsWithInformation.length / descids.length) * 100;
                this.percentage = +this.percentage.toFixed(2);
              },
              (error) => {
              }
            );

          this.skillDetails = details;
          this.levelNames = details[0].levels.map(
            (level: any) => level.level_name
          );
          this.levelNames = this.getUniqueItems(this.levelNames);
        },
        (error) => {
          console.error('Error fetching skill details:');
        }
      );
  }

  showDetails(levelName: string) {
    this.http
      .get(
        `${this.ENV_REST_API}/search?codeskill=${this.codeskill}&level_name=${levelName}`
      )
      .subscribe((details: any) => {
        this.selectedMetal = levelName;
        const selectedLevels = details[0]?.levels.filter(
          (level: any) => level.level_name === levelName
        );

        if (selectedLevels && selectedLevels.length > 0) {
          const descriptions = selectedLevels.map((level: any) => {
            const description_text =
              level.descriptions[0]?.description_text || '';
            const descid = level.descriptions[0]?.id || '';
            return { description_text, descid };
          });

          this.selectedLevelDescriptions = descriptions;
          const descids = this.selectedLevelDescriptions.map((description) =>
            description.descid.trim()
          );
        } else {
          this.selectedLevelDescriptions = [
            { description_text: 'Level not found', descid: '' },
          ];
        }
      });
  }

  getInformationByDescid(descid: string): string {
    const informationRecord = this.information.find(
      (info) => info.descid.toString() === descid
    );
    return informationRecord ? informationRecord.info_text : '';
  }

  addInformation(i: number) {
    if (this.isLoggedIn) {
      this.visible[i] = true;
      this.selectedDescriptionIndex = i;
      this.updateForm.patchValue({
        info_text: '',
      });
    } else {
      this.router.navigate(['/login']);
    }

    const selectedDescription = this.selectedLevelDescriptions[i];
    const descid = selectedDescription.descid;
  }

  updatedDescStatus: boolean[] = [];
  isLoading = false;

  saveAddInformation() {
    if (this.selectedDescriptionIndex !== null && !this.isLoading) {
      this.isLoading = true;
      const formData = this.updateForm.value;
      const descid =
        this.selectedLevelDescriptions[this.selectedDescriptionIndex].descid;

      this.http
        .post(`${this.ENV_REST_API}/createDatacollection`, formData, {
          params: { descriptionId: descid },
          withCredentials: true,
        })
        .subscribe({
          next: (res: any) => {
            if (this.selectedDescriptionIndex !== null) {
              this.updatedDescStatus[this.selectedDescriptionIndex] = true;
            }

            const info_text = formData.info_text;

            const newInformation = { info_id: res.info_id, info_text, descid };
            this.information.push(newInformation);

            this.information.sort((a, b) => {
              return a.descid.localeCompare(b.descid);
            });

            this.getInformationByDescid(descid);
            this.fetchSkillDetails();

            if (this.selectedDescriptionIndex !== null) {
              this.visible[this.selectedDescriptionIndex] = false;
            }

            this.updateForm.reset({
              info_text: '',
            });

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Add data successfully',
            });

            setTimeout(() => {
              this.messageService.clear();
            }, 2500);

            this.isLoading = false;
          },
          error: (err) => {
            if (err.error.message === 'Error fetching data from info_text URL. Hostname not found.') {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Your link is undefined. Please try again',
              });
              setTimeout(() => {
                this.messageService.clear();
              }, 2500);
            }

            this.isLoading = false;
          },
        });
    }
  }

  displayEditInformation: boolean = false;

  editInformation(information: any) {
    this.updateForm.patchValue({
      info_id: information.info_id,
      info_text: information.info_text,
      descid: information.descid,
    });

    this.displayEditInformation = true;
  }

  saveEditInformation() {
    if (!this.isLoading) {
      this.isLoading = true;
      const formData = this.updateForm.value;
      const informationId = formData.info_id;

      this.http
        .put(`${this.ENV_REST_API}/updateDatacollection`, formData, {
          params: { informationId: informationId },
          withCredentials: true,
        })
        .subscribe({
          next: (res: any) => {
            this.fetchSkillDetails();
            this.displayEditInformation = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Edit data successfully',
            });

            setTimeout(() => {
              this.messageService.clear();
            }, 2500);

            this.isLoading = false;
          },
          error: (err) => {
            if (err.error.message === 'Error fetching data from info_text URL. Hostname not found.') {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Your link is undefined. Please try again',
              });
  
              setTimeout(() => {
                this.messageService.clear();
              }, 2500);

            }
            this.isLoading = false;
          },
        });
    }
  }

  deleteInformation(information: any) {
    this.updateForm.patchValue({
      info_id: information.info_id,
      info_text: information.info_text,
      descid: information.descid,
    });
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: 'Confirmation',
      detail: 'Are you sure you want to proceed?',
    });
  }

  onConfirm() {
    const formData = this.updateForm.value;
    const informationId = formData.info_id;

    this.http
      .delete(`${this.ENV_REST_API}/deleteDatacollection`, {
        params: { informationId: informationId },
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.fetchSkillDetails();
          this.messageService.clear('confirm');
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Information deleted successfully',
          });

          setTimeout(() => {
            this.messageService.clear();
          }, 2500);

          this.fetchSkillDetails();
        },
        error: (err) => {
          this.messageService.clear('confirm');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete Information',
          });

          setTimeout(() => {
            this.messageService.clear();
          }, 2500);
        },
      });
  }

  onReject() {
    this.messageService.clear('confirm');
    this.messageService.add({
      severity: 'error',
      summary: 'Rejected',
      detail: 'you have rejected',
    });
  }

  private getUniqueItems(array: string[]): string[] {
    const uniqueArray: string[] = [];
    array.forEach((item) => {
      if (!uniqueArray.includes(item)) {
        uniqueArray.push(item);
      }
    });
    return uniqueArray;
  }

  isLink(url: string): boolean {
    return url.includes('://');
  }

  displayPartialURL(fullURL: string, maxLength: number = 40): string {
    const urlParts = fullURL.split('://');
    let displayURL = urlParts[urlParts.length - 1];

    displayURL = displayURL.trim();

    if (displayURL.length > maxLength) {
      return displayURL.substr(0, maxLength) + '...';
    }

    return displayURL.trim() !== '' ? displayURL : fullURL;
  }


  getSkillColorClass(percentage: number | undefined): string {
    if (percentage !== undefined) {
      if (percentage >= 0 && percentage <= 50) {
        return 'bg-yellow-200';
      } else if (percentage > 50 && percentage <= 99) {
        return 'bg-orange-400';
      } else {
        return 'bg-green-500';
      }
    }
    return '';
  }
}