import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { Emitter } from 'src/app/emitters/emitter';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private http: HttpClient,
    private envEndpointService: EnvEndpointService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | Dowload');
    this.http.get(`${this.ENV_REST_API}/user`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true)
          AuthInterceptor.accessToken
        },
        error: () => {
          Emitter.authEmitter.emit(false)
        }
      });
  }

  downloadFile1() {
    const fileUrl = "/assets/file/SFIA 8 Summary Chart  v8.0.sfiasummary.en.210928.pdf";

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'SFIA 8 Summary Chart v8.0.sfiasummary.en.210928.pdf';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  downloadFile2() {
    const fileUrl = "/assets/file/About SFIA v8.0.aboutsfia.en.210928.pdf";

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'About SFIA v8.0.aboutsfia.en.210928.pdf';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  downloadFile3() {
    const fileUrl = "/assets/file/sfia-8_en_220221.xlsx";

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'sfia-8_en_220221.xlsx';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  downloadFile4() {
    const fileUrl = "/assets/file/SFIA 8 The framework reference v8.0.sfiaref.en.211101.pdf";

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'SFIA 8 The framework reference v8.0.sfiaref.en.211101.pdf';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }
}
