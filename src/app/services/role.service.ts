import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Role } from '../models/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private urlApiUsuario = environment.api_url + 'roles';

  constructor(private http: HttpClient) { }

  getRoles (): Observable<Role[]> {
    return this.http.get<Role[]>(this.urlApiUsuario);
  }

}
