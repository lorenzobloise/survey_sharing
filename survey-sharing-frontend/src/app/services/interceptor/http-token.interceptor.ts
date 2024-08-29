import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/token.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // If the request comes from these two urls, there's no need to attach the token
    const excluded_urls = ['http://localhost:8080/users/search/single/by_email','http://localhost:8080/users/search/single/by_username'];
    if(excluded_urls.some(url => request.url.includes(url)))
      return next.handle(request);
    const token = this.tokenService.token;
    if(token){
      const authReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}
