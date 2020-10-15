import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((errorResponse: HttpErrorResponse) => {
            // const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;

            // if (error.status === 401 && error.error.status === 'Token is Expired') {
            //     const http = this.injector.get(HttpClient);

            //     return http.get<any>(environment.api_url + 'auth/refresh', {}).pipe(
            //         mergeMap(data => {
            //             localStorage.setItem('token', data.token);
            //             const cloneRequest = request.clone({ setHeaders: { 'Authorization': 'Bearer ' + data.token } });

            //             return next.handle(cloneRequest);
            //         })
            //     );
            // }

            return throwError(errorResponse);
        }));
    }
}