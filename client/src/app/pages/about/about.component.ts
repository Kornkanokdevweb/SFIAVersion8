import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitter } from 'src/app/emitters/emitter'; 
import * as AOS from 'aos'
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private http: HttpClient,
    private envEndpointService: EnvEndpointService,
    private titleService: Title
  ) { }
  
  ngOnInit(): void {
    this.titleService.setTitle('SFIAV8 | About us');
    AOS.init()
    window.addEventListener('load',AOS.refresh)
    this.http.get(`${this.ENV_REST_API}/user`)
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          Emitter.authEmitter.emit(false)
        }
      });
  }
}
