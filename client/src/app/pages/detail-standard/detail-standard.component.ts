import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emitter } from 'src/app/emitters/emitter';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

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
    private envEndpointService: EnvEndpointService
  ) {
    this.updateForm = this.formBuilder.group({
      info_id: '',
      info_text: ['', [Validators.required, Validators.pattern('^(https?|ftp):\\/\\/(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,})+(\\/[^\\s]*)?$')]],
      descid: '',
    });
  }

  ngOnInit(): void {
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
          console.log(details);
          const levelNameMap = new Map<string, number[]>();

          details[0].levels.forEach((level: any) => {
            const levelName = level.level_name;
            const id = level.id;

            // ถ้า level_name ยังไม่ถูกเพิ่มใน Map
            if (!levelNameMap.has(levelName)) {
              levelNameMap.set(levelName, [id]);
            } else {
              // ถ้า level_name ถูกเพิ่มแล้ว
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

              console.log(descLengthMap);
              console.log(
                `Length of ${levelName} for desc${ids}: ${descLength}`
              );

              return {
                level_name: level_name,
                description: {
                  //id: ids,
                  desc: ids.map((id) => `desc${id}`),
                },
              };
            }
          );
          console.log(descids); // ค่า descids ได้ถูกเก็บในตัวแปรนี้

          temporarySkillDetails = this.skillDetails;
          console.log(this.skillDetails);

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
                console.log('Have Data Current:', this.information);
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
                  // console.log(levelDetails);
                  if (levelDetails) {
                    const descIdsForLevel = levelDetails.description.desc;
                    const descIdsWithInformationForLevel =
                      descIdsWithInformation.filter((descid) =>
                        descIdsForLevel.includes(descid)
                      );
                    const percentageForLevel = parseFloat(((descIdsWithInformationForLevel.length / descIdsForLevel.length) * 100).toFixed(2));
                    this.percentageMap.set(levelName, percentageForLevel);
                    console.log(levelDetails, '=>', 'ข้อมูลทั้งหมดมีจำนวน: ', descIdsForLevel.length, 'มีข้อมูลแล้วจำนวน: ', descIdsWithInformationForLevel.length, `Percentage of ${levelName}: `, percentageForLevel);
                    // console.log(`Percentage for ${levelName}: ${percentageForLevel}`);
                  }
                });

                // const descIdsWithInformation = this.getDescIdsWithInformation(this.information, descids);
                this.percentage =
                  (descIdsWithInformation.length / descids.length) * 100;
                this.percentage = +this.percentage.toFixed(2);
                console.log(`Percentage all of codeSkill:`, this.percentage)
                console.log(`Value length of descIds is:`, descids.length);
                console.log(`User Have Value length of descIds is:`, this.information);
              },
              (error) => {
                console.error('Error fetching skill details:', error);
              }
            );

          this.skillDetails = details;
          this.levelNames = details[0].levels.map(
            (level: any) => level.level_name
          );
          this.levelNames = this.getUniqueItems(this.levelNames);
        },
        (error) => {
          console.error('Error fetching skill details:', error);
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
        console.log(this.selectedMetal);
        console.log(this.codeskill);
        const selectedLevels = details[0]?.levels.filter(
          (level: any) => level.level_name === levelName
        );

        if (selectedLevels && selectedLevels.length > 0) {
          // สร้างอาร์เรย์ของคำอธิบายของทุก level ที่เกี่ยวข้อง
          const descriptions = selectedLevels.map((level: any) => {
            const description_text =
              level.descriptions[0]?.description_text || '';
            const descid = level.descriptions[0]?.id || '';
            return { description_text, descid };
          });

          // รวมข้อมูลใน descriptions และเขียนเป็นข้อความที่สามารถแสดงได้ใน HTML
          this.selectedLevelDescriptions = descriptions;
          console.log(this.selectedLevelDescriptions);
          const descids = this.selectedLevelDescriptions.map((description) =>
            description.descid.trim()
          );
          console.log('descidssss', descids);
          console.log(this.selectedLevelDescriptions);
          // this.getInformation(descids);
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
    console.log('Selected descid:', selectedDescription.descid);
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
            // ระบุประเภทของ 'res' เป็น 'any' เพื่อให้มีคุณสมบัติ 'info_id' ใช้ได้
            console.log(
              'Information created successfully:',
              res,
              this.information
            );

            // อัปเดตสถานะของ descid เพื่อบอกว่ามีข้อมูลใหม่สำหรับ descid นี้
            if (this.selectedDescriptionIndex !== null) {
              this.updatedDescStatus[this.selectedDescriptionIndex] = true;
            }

            // อัปเดตหรือเพิ่มข้อมูลที่ถูกบันทึกไปที่ information array

            const info_text = formData.info_text;

            const newInformation = { info_id: res.info_id, info_text, descid };
            this.information.push(newInformation);

            this.information.sort((a, b) => {
              return a.descid.localeCompare(b.descid);
            });

            this.getInformationByDescid(descid);
            this.fetchSkillDetails();
            // หลังจากจบการทำงาน ตั้งค่า visible ให้เป็น false เพื่อปิด dialog
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
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error creating Information:', err);
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
    console.log(information);
    console.log("Form Values after patchValue:", this.updateForm.value);
    console.log(this.editInformation);

    this.displayEditInformation = true;
  }

  saveEditInformation() {
    if (!this.isLoading) {
      this.isLoading = true;
      const formData = this.updateForm.value;
      const informationId = formData.info_id;

      console.log(informationId);
      this.http
        .put(`${this.ENV_REST_API}/updateDatacollection`, formData, {
          params: { informationId: informationId },
          withCredentials: true,
        })
        .subscribe({
          next: (res: any) => {
            console.log('Information updated successfully:', res);
            this.fetchSkillDetails();
            this.displayEditInformation = false;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error updating Information:', err);
            this.isLoading = false;
          },
        });

    }

  }

  // ในเมทอด deleteInformation
  deleteInformation(information: any) {
    this.updateForm.patchValue({
      info_id: information.info_id, // เพิ่ม informationId ลงในฟอร์ม
      info_text: information.info_text,
      descid: information.descid,
    });
    console.log(information);
    console.log("Form Values after patchValue:", this.updateForm.value);
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
    console.log(informationId);

    this.http
      .delete(`${this.ENV_REST_API}/deleteDatacollection`, {
        params: { informationId: informationId },
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          console.log('Information deleted successfully:', res);
          this.fetchSkillDetails();
          this.messageService.clear('confirm');
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Information deleted successfully',
          });
          console.log("🚀 ~ file: detail-standard.component.ts:453 ~ DetailStandardComponent ~ onConfirm ~ informationId:", informationId)
          this.fetchSkillDetails();
        },
        error: (err) => {
          console.error('Error deleting Information:', err);
          this.messageService.clear('confirm');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete Information',
          });
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