import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("REFRESH-TOKEN.INTERCEPTOR: ");

        return next.handle(request).pipe(catchError((errorResponse: HttpErrorResponse) => {
             return throwError(errorResponse);
        }));
    }
}