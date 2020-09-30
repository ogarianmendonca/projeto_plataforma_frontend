import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UsuarioService } from '../../services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Pessoa } from '../../models/pessoa.interface';
import { PessoaService } from '../../services/pessoa.service';
import { formatDate } from "@angular/common";
import { ServicosExternoService } from '../../services/servicos-externo.service';
import { NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public active = 1;
  public usuario: Usuario;
  public formUsuario: FormGroup;
  public imagem: Set<File>;
  public paisSelecionadoBrasil: any = false;
  public docSelecionadoCPF: any = false;
  public anoVigente: any = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private pessoaService: PessoaService,
    private externoService: ServicosExternoService
  ) {
  }

  ngOnInit() {
    this.buscaUsuarioLogado();
  }

  buscaUsuarioLogado() {
    this.ngxLoader.start();

    this.authService.getUsuarioAutenticado()
      .subscribe((resp: Usuario) => {
        this.usuario = resp;
        this.validaFormUsuario(this.usuario);
        this.verificaPaisCadastrado(this.usuario.pessoa.pais);
        this.tipoDocumentoCadastrado(this.usuario.pessoa.tipo_doc);
        this.ngxLoader.stop();
      });
  }

  validaFormUsuario(usuario) {
    this.formUsuario = this.formBuilder.group({
      name: [usuario.name, [Validators.required]],
      email: [usuario.email, [Validators.required, Validators.email]],
      status: [usuario.status],
      image: [''],
      password: [''],
      confimarSenha: [''],
      pessoa: this.formBuilder.group({
        id: [usuario.pessoa.id],
        usuario_id: [usuario.pessoa.usuario_id],
        endereco: [usuario.pessoa.endereco],
        bairro: [usuario.pessoa.bairro],
        cidade: [usuario.pessoa.cidade],
        numero: [usuario.pessoa.numero],
        uf: [usuario.pessoa.uf],
        cep: [usuario.pessoa.cep],
        pais: [usuario.pessoa.pais],
        complemento: [usuario.pessoa.complemento],
        tipo_doc: [usuario.pessoa.tipo_doc],
        num_doc: [usuario.pessoa.num_doc],
        data_nasc: [{
          'year': Number(formatDate(usuario.pessoa.data_nasc, 'yyyy', 'en-US')),
          'month': Number(formatDate(usuario.pessoa.data_nasc, 'MM', 'en-US')),
          'day': Number(formatDate(usuario.pessoa.data_nasc, 'dd', 'en-US'))
        }],
        sexo: [usuario.pessoa.sexo],
        telefone: [usuario.pessoa.telefone]
      })
    });
  }

  carregaImagem(event: any) {
    this.imagem = event.target.files;
  }

  editaUsuario() {
    this.ngxLoader.start();

    if (this.formUsuario.value.password !== this.formUsuario.value.confimarSenha) {
      this.showAviso('As senhas não conferem!', 'warning', 'ui-1_bell-53');
      this.ngxLoader.stop();
      return false;
    }

    const id = this.usuario['id'];
    this.formataDataNascimentoEnvio(this.formUsuario.value.pessoa.data_nasc);

    if (!this.imagem) {
      this.usuarioService.editarUsuario(id, this.formUsuario.value).subscribe((resp: Usuario) => {
        this.editaDadosPessoa(this.formUsuario.value.pessoa);
        this.showAviso('Usuário editado com sucesso!', 'success', 'ui-2_like');
        this.buscaUsuarioLogado();
        this.active = 1;
      }, (err) => {
        this.showAviso('Erro ao editar usuário!', 'warning', 'ui-1_bell-53');
        this.ngxLoader.stop();
      });
    } else {
      this.usuarioService.enviarImagem(this.imagem).subscribe(resImg => {
        this.formUsuario.value.image = resImg['image'];

        this.usuarioService.editarUsuario(id, this.formUsuario.value).subscribe((resp: Usuario) => {
          this.editaDadosPessoa(this.formUsuario.value.pessoa);
          this.showAviso('Usuário editado com sucesso!', 'success', 'ui-2_like');
          this.buscaUsuarioLogado();
          this.active = 1;
        }, (err) => {
          this.showAviso('Erro ao editar usuário!', 'warning', 'ui-1_bell-53');
          this.ngxLoader.stop();
        })
      });
    }
  }

  editaDadosPessoa(dadosPessoa) {
    this.pessoaService.editarPessoa(dadosPessoa.id, dadosPessoa).subscribe((resp: Pessoa) => {
      return true;
    }, (err) => {
      this.showAviso('Erro ao editar dados pessoais e endereço!', 'warning', 'ui-1_bell-53');
      this.ngxLoader.stop();
      return false;
    });
  }

  formataDataNascimentoEnvio(dataNascimento) {
    this.formUsuario.value.pessoa.data_nasc = `${dataNascimento.year}-${dataNascimento.month}-${dataNascimento.day} 00:00:00`
  }

  tipoDocumentoCadastrado(tipoDoc) {
    if (tipoDoc == 'CPF') {
      this.docSelecionadoCPF = true;
    } else {
      this.docSelecionadoCPF = false;
    }
  }

  tipoDocumentoSelecionado(event: any) {
    if (event.target.value == 'CPF') {
      this.docSelecionadoCPF = true;
    } else {
      this.docSelecionadoCPF = false;
    }
  }

  verificaPaisCadastrado(pais: string) {
    if (pais && (pais.toUpperCase() == 'Brasil' || pais.toUpperCase() == 'BRASIL')) {
      this.paisSelecionadoBrasil = true;
    } else {
      this.paisSelecionadoBrasil = false;
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

      this.externoService.bsucarEnderecoPorCEP(event.target.value).subscribe((resp: Pessoa) => {
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
