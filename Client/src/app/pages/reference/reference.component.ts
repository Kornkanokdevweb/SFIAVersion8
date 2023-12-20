import { Component } from '@angular/core';
import { Emitter } from 'src/app/emitters/emitter';
import { HttpClient } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent {

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private http: HttpClient,
    private envEndpointService: EnvEndpointService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | Reference');
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
}
