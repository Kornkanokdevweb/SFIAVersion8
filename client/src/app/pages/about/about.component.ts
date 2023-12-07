import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Emitter } from 'src/app/emitters/emitter'; 
import * as AOS from 'aos'
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private http: HttpClient,
    private envEndpointService: EnvEndpointService
  ) { }
  
  ngOnInit(): void {
    AOS.init()
    window.addEventListener('load',AOS.refresh)
    this.http.get(`${this.ENV_REST_API}/user`)
      .subscribe({
        next: (res: any) => {
          Emitter.authEmitter.emit(true)
        },
        error: () => {
          console.log(`You are not logged in`)
          Emitter.authEmitter.emit(false)
        }
      });
  }
}
