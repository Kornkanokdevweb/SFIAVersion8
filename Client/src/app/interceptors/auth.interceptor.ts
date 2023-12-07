import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import { catchError, Observable, throwError, switchMap } from 'rxjs';
import { EnvEndpointService } from 'src/app/service/env.endpoint.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  static accessToken = '';
  refresh = false;
  ENV_REST_API = `${this.envEndpointService.ENV_REST_API}`

  constructor(
    private http: HttpClient,
    private envEndpointService: EnvEndpointService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthInterceptor.accessToken}`
      }
    });

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if(err.status === 401 && !this.refresh){
        this.refresh = true;

        return this.http.post(`${this.ENV_REST_API}/refresh`, {}, {withCredentials: true}).pipe(
          switchMap((res: any) => {
            AuthInterceptor.accessToken = res.token;
            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${AuthInterceptor.accessToken}`
              }
            }));
          })
        );
      }
      this.refresh = false;
      return throwError(() => err)
    }));
  }
}
