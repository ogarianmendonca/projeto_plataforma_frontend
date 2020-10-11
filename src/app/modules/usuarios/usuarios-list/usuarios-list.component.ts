import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Usuario } from '../../../models/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {

  public usuarios: Usuario[];
  public nomeUsuarioExclusao: string;
  public _filtroLista = '';
  public usuariosFiltrados: Usuario[];

  constructor(
    private usuarioService: UsuarioService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.usuariosFiltrados = this.filtroLista ? this.filtrarUsuario(this.filtroLista) : this.usuarios;
  }

  ngOnInit() {
    this.buscarUsuarios();
  }

  filtrarUsuario(filtrarPor: string): Usuario[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.usuarios.filter(
      usuario => usuario.name.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  buscarUsuarios() {
    this.ngxLoader.start();
    
    this.usuarioService.getUsuarios().subscribe((resp: Usuario[]) => {
      this.usuarios = resp;
      this.usuariosFiltrados = resp;
      this.ngxLoader.stop();
    });
  }

  openModalExcluirUsuario(content: any, usuario: Usuario) {
    this.nomeUsuarioExclusao = usuario.name;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if ("sim" === result) {
        this.ngxLoader.start();

        this.usuarioService.excluirUsuario(usuario.id).subscribe((resp: any) => {
          this.showAviso('Usuário excluído com sucesso!', 'success', 'ui-2_like');
          this.buscarUsuarios();
        }, (error: any) => {
          this.showAviso('Erro ao excluir usuário!', 'warning', 'ui-1_bell-53');
          this.ngxLoader.stop();
        })
      }
    }, (reason) => {
    });
  }

  showAviso(mensagem: string, tipoAlerta: string, icone: string) {
    this.toastr.info(`<span class="now-ui-icons ${icone}"></span><b>${mensagem}</b>`, '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: `alert alert-${tipoAlerta}  alert-with-icon`,
      positionClass: 'toast-top-right'
    });
  }
}
