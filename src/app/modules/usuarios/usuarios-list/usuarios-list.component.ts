import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Usuario } from '../../../models/usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Role } from '../../../models/role.interface';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {
  public usuarios: Usuario[];
  public usuario: Usuario;
  public _filtroLista = '';
  public usuariosFiltrados: Usuario[];
  public roles: Role[];
  public rolesSelecionado: FormArray;
  public formRoles: FormGroup;
  public usuarioLogado: Usuario;
  public acaoPermitida: boolean = false;

  public totalPaginas: number;
  public paginaAtual: number;

  constructor(
    private usuarioService: UsuarioService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.usuariosFiltrados = this.filtroLista ? this.filtrarUsuario(this.filtroLista) : this.usuarios;
  }

  ngOnInit() {
    this.verificaUsuarioLogado();
    this.buscarUsuarios();
    this.buscarRoles();
  }

  verificaUsuarioLogado() {
    this.usuarioLogado = this.authService.getUsuarioStorage();
    this.usuarioLogado.roles.forEach(element => {
      if (element.name === 'ADMINISTRADOR' || element.name === 'COORDENADOR') {
        this.acaoPermitida = true;
      }
    });
  }

  filtrarUsuario(filtrarPor: string): Usuario[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.usuarios.filter(
      usuario => usuario.name.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  buscarUsuarios(pagina = 1) {
    this.ngxLoader.start();
    
    this.usuarioService.getUsuarios(pagina).subscribe((resp) => {
      this.totalPaginas = resp['last_page'] * 10; 
      this.paginaAtual =  resp['current_page'];

      this.usuarios = resp['data'];
      this.usuariosFiltrados = resp['data'];
      this.ngxLoader.stop();
    });
  }

  loadPage(numProximaPagina) {
    this.buscarUsuarios(numProximaPagina);
  }
  
  buscarRoles() {
    this.ngxLoader.start();

    this.roleService.getRoles().subscribe((resp: Role[]) => {
      this.roles = resp;
      this.ngxLoader.stop();
    })
  }

  openModalExcluirUsuario(content: any, usuario: Usuario) {
    this.usuario = usuario;

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
  
  openModalAlterarFuncoes(content2: any, usuario: Usuario) {
    this.usuario = usuario;
    this.validaFormRoles();

    this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if ("sim" === result) {
        this.ngxLoader.start();

        this.usuario.roles = this.formRoles.value.roles;

        this.usuarioService.editarUsuario(usuario.id, this.usuario).subscribe((resp: Usuario) => {
          this.showAviso('Usuário editado com sucesso!', 'success', 'ui-2_like');
          this.buscarUsuarios();
          this.buscarRoles();
        }, (err) => {
          this.showAviso('Erro ao editar usuário!', 'warning', 'ui-1_bell-53');
          this.ngxLoader.stop();
        });
      }
    }, (reason) => {
    });
  }

  validaFormRoles() {
    this.formRoles = this.formBuilder.group({
      roles: this.formBuilder.array([])
    });

    this.rolesSelecionado = this.formRoles.get('roles') as FormArray;

    this.usuario.roles.forEach(element => {
      this.rolesSelecionado.push(new FormControl(element.id.toString()));
    });
  }

  onCheckboxChange(e) {    
    if (e.target.checked) {
      this.rolesSelecionado.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      this.rolesSelecionado.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          this.rolesSelecionado.removeAt(i);
          return;
        }
        i++;
      });
    }
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
