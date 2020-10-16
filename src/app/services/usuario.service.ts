import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.interface';

/**
 * Usar em requisições post e put
 */
const httpOptions = {
  headers: new HttpHeaders(
    {'Content-Type': 'application/json'}
  )
};

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApiUsuario = environment.api_url + 'usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios (): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.urlApiUsuario);
  }

  cadastrarUsuario (dados): Observable<Usuario> {
    return this.http.post<Usuario>(this.urlApiUsuario + '/store', dados, httpOptions);
  }

  getUsuarioId(id) {
    return this.http.get<Usuario>(this.urlApiUsuario + '/show/' + id);
  }

  editarUsuario (id, dados): Observable<Usuario> {
    return this.http.put<Usuario>(this.urlApiUsuario + '/update/' + id, dados, httpOptions);
  }

  excluirUsuario(id) {
    return this.http.delete(this.urlApiUsuario + '/delete/' + id);
  }

  enviarImagem(arquivo) {
    const formData = new FormData();
    formData.append('image', arquivo[0]);
    return this.http.post(this.urlApiUsuario + '/upload', formData);
  }

}
