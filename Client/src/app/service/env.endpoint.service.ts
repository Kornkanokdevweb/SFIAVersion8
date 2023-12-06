import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvEndpointService {

  // Node-Express API endpoint
  ENV_REST_API: string = 'http://localhost:8080/api';

  constructor() { }
}
