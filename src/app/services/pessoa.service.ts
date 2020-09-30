import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pessoa } from '../models/pessoa.interface';

/**
 * Usar em requisições post e put
 */
const httpOptions = {
  headers: new HttpHeaders(
    { 'Content-Type': 'application/json' }
  )
};

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private urlApiPessoa = environment.api_url + 'pessoas/';

  constructor(private http: HttpClient) { }

  // cadastrarPessoa (dados): Observable<Pessoa> {
  //   return this.http.post<Pessoa>(this.urlApiPessoa + 'store', dados, httpOptions);
  // }

  editarPessoa(id, dados): Observable<Pessoa> {
    return this.http.put<Pessoa>(this.urlApiPessoa + 'update/' + id, dados, httpOptions);
  }

  // excluirPessoa(id) {
  //   return this.http.put(this.urlApiPessoa + 'delete/' + id, [], httpOptions);
  // }

}
