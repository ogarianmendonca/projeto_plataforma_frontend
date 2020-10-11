import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Role } from '../../../models/role.interface';
import { RoleService } from '../../../services/role.service';
import { Pessoa } from '../../../models/pessoa.interface';
import { Usuario } from '../../../models/usuario.interface';
import { AuthService } from '../../../services/auth.service';
import { PessoaService } from '../../../services/pessoa.service';
import { ServicosExternoService } from '../../../services/servicos-externo.service';
import { UsuarioService } from '../../../services/usuario.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-usuarios-create',
  templateUrl: './usuarios-create.component.html',
  styleUrls: ['./usuarios-create.component.scss']
})
export class UsuariosCreateComponent implements OnInit {

  public active = 1;
  public usuario: Usuario;
  public formUsuario: FormGroup;
  public imagem: Set<File>;
  public paisSelecionadoBrasil: boolean = true;
  public docSelecionadoCPF: boolean = false;
  public dataVigente: Date = new Date();
  public roles: Role[];
  public rolesSelecionado: FormArray;
  public focusDtNasc: boolean = false;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private pessoaService: PessoaService,
    private externoService: ServicosExternoService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.validaFormUsuario();
    this.buscarRoles();
  }

  buscarRoles() {
    this.ngxLoader.start();

    this.roleService.getRoles().subscribe((resp: Role[]) => {
      this.roles = resp;
      this.ngxLoader.stop();
    })
  }

  validaFormUsuario() {
    this.formUsuario = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      status: [''],
      image: [''],
      password: ['', [Validators.required]],
      confimarSenha: ['', [Validators.required]],
      roles: this.formBuilder.array([]),
      pessoa: this.formBuilder.group({
        usuario_id: [''],
        endereco: [''],
        bairro: [''],
        cidade: [''],
        numero: [''],
        uf: [''],
        cep: [''],
        pais: ['BRASIL'],
        complemento: [''],
        tipo_doc: [''],
        num_doc: [''],
        data_nasc: [formatDate(this.dataVigente, 'dd/MM/yyyy', 'pt-BR')],
        sexo: [''],
        telefone: ['']
      })
    });
  }

  carregaImagem(event: any) {
    this.imagem = event.target.files;
  }

  cadastraUsuario() {
    this.ngxLoader.start();

    if (this.formUsuario.value.password !== this.formUsuario.value.confimarSenha) {
      this.showAviso('As senhas não conferem!', 'warning', 'ui-1_bell-53');
      this.ngxLoader.stop();
      return false;
    }

    this.formataDataNascimentoEnvio(this.formUsuario.value.pessoa.data_nasc);

    if (!this.imagem) {
      this.usuarioService.cadastrarUsuario(this.formUsuario.value).subscribe((resp: any) => {
        this.cadastraDadosPessoa(resp.user.id, this.formUsuario.value.pessoa);
      }, (err) => {
        this.showAviso('Erro ao cadastrar usuário!', 'warning', 'ui-1_bell-53');
        this.ngxLoader.stop();
      });
    } else {
      this.usuarioService.enviarImagem(this.imagem).subscribe(resImg => {
        this.formUsuario.value.image = resImg['image'];

        this.usuarioService.cadastrarUsuario(this.formUsuario.value).subscribe((resp: any) => {
          this.cadastraDadosPessoa(resp.user.id, this.formUsuario.value.pessoa);
        }, (err) => {
          this.showAviso('Erro ao cadastrar usuário!', 'warning', 'ui-1_bell-53');
          this.ngxLoader.stop();
        })
      });
    }
  }

  cadastraDadosPessoa(usuarioId: any, dadosPessoa: Pessoa) {
    dadosPessoa.usuario_id = usuarioId;

    this.pessoaService.cadastrarPessoa(dadosPessoa).subscribe((resp: Pessoa) => {
      this.showAviso('Usuário cadastrado com sucesso!', 'success', 'ui-2_like');
      this.validaFormUsuario();
      this.active = 1;
      this.ngxLoader.stop();
    }, (err) => {
      this.showAviso('Erro ao cadastrar dados do usuário!', 'warning', 'ui-1_bell-53');
      this.ngxLoader.stop();
    });
  }

  formataDataNascimentoEnvio(dataNascimento: any) {
    if(dataNascimento == undefined || dataNascimento == null || dataNascimento == '') {
      this.formUsuario.value.pessoa.data_nasc = null;
    } else if (formatDate(this.dataVigente, 'dd/MM/yyyy', 'pt-BR') === dataNascimento) {
      this.formUsuario.value.pessoa.data_nasc = null;
    } else {
      var arrayDataNascimento = dataNascimento.split('/');
      this.formUsuario.value.pessoa.data_nasc = `${arrayDataNascimento[2]}-${arrayDataNascimento[1]}-${arrayDataNascimento[0]} 00:00:00`
    }
  }

  verificaDocumentoSelecionado(event: any) {
    this.formUsuario.patchValue({pessoa: {num_doc: ''}});
    if (event.target.value == 'CPF') {
      this.docSelecionadoCPF = true;
    } else {
      this.docSelecionadoCPF = false;
    }
  }

  verificaPaisSelecionado(event: any) {
    if (event.target.value.toUpperCase() == 'BRASIL') {
      this.paisSelecionadoBrasil = true;
    } else {
      this.paisSelecionadoBrasil = false;
    }
  }

  buscaPorCEP(event: any) {
    if (event.target.value.length == 9) {
      this.ngxLoader.start();

      this.externoService.buscarEnderecoPorCEP(event.target.value).subscribe((resp: any) => {
        if (resp.erro) {
          this.showAviso('CEP não encontrado!', 'warning', 'ui-1_bell-53');
          this.ngxLoader.stop();
          return;
        }

        this.formUsuario.patchValue(
          {
            pessoa: {
              endereco: resp['logradouro'],
              bairro: resp['bairro'],
              cidade: resp['localidade'],
              uf: resp['uf'],
              cep: resp['cep'].replace('-',''),
              pais: 'Brasil',
              complemento: resp['complemento'],
              numero: null
            }
          }
        );
        this.ngxLoader.stop();
      }, (err) => {
        this.showAviso('CEP não encontrado!', 'warning', 'ui-1_bell-53');
        this.ngxLoader.stop();
      });
    }
  }
  
  onCheckboxChange(e) {
    this.rolesSelecionado = this.formUsuario.get('roles') as FormArray;
    
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
