import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicosExternoService {

  constructor(private http: HttpClient) { }

  buscarEnderecoPorCEP(cep: string): Observable<any> {
    return this.http.get<any>('https://viacep.com.br/ws/'+cep+'/json');
  }

}
