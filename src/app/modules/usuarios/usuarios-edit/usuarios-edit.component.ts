import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Pessoa } from '../../../models/pessoa.interface';
import { Usuario } from '../../../models/usuario.interface';
import { AuthService } from '../../../services/auth.service';
import { PessoaService } from '../../../services/pessoa.service';
import { ServicosExternoService } from '../../../services/servicos-externo.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.component.html',
  styleUrls: ['./usuarios-edit.component.scss']
})
export class UsuariosEditComponent implements OnInit {

  public active = 1;
  public usuario: Usuario;
  public formUsuario: FormGroup;
  public imagem: Set<File>;
  public paisSelecionadoBrasil: boolean = false;
  public docSelecionadoCPF: boolean = false;
  public dataVigente: Date = new Date();
  public focusDtNasc: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private routerActivated: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private pessoaService: PessoaService,
    private externoService: ServicosExternoService
  ) {
  }

  ngOnInit() {
    this.buscaUsuarioSelecionado();
  }

  buscaUsuarioSelecionado() {
    const id = this.routerActivated.snapshot.params['id'];

    this.ngxLoader.start();

    this.usuarioService.getUsuarioId(id).subscribe((resp: Usuario) => {
        this.usuario = resp;
        this.validaFormUsuario(this.usuario);
        this.verificaPaisCadastrado(this.usuario.pessoa.pais);
        this.verificaDocumentoCadastrado(this.usuario.pessoa.tipo_doc);
        this.ngxLoader.stop();
      });
  }
  
  validaFormUsuario(usuario: Usuario) {
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
        data_nasc: [formatDate(usuario.pessoa.data_nasc ?? this.dataVigente, 'dd/MM/yyyy', 'pt-BR')],
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
      }, (err) => {
        this.showAviso('Erro ao editar usuário!', 'warning', 'ui-1_bell-53');
        this.ngxLoader.stop();
      });
    } else {
      this.usuarioService.enviarImagem(this.imagem).subscribe(resImg => {
        this.formUsuario.value.image = resImg['image'];

        this.usuarioService.editarUsuario(id, this.formUsuario.value).subscribe((resp: Usuario) => {
          this.editaDadosPessoa(this.formUsuario.value.pessoa);
        }, (err) => {
          this.showAviso('Erro ao editar usuário!', 'warning', 'ui-1_bell-53');
          this.ngxLoader.stop();
        })
      });
    }
  }

  editaDadosPessoa(dadosPessoa: Pessoa) {
    this.pessoaService.editarPessoa(dadosPessoa.id, dadosPessoa).subscribe((resp: Pessoa) => {
      this.showAviso('Usuário editado com sucesso!', 'success', 'ui-2_like');
      this.buscaUsuarioSelecionado();
      this.active = 1;
      return true;
    }, (err) => {
      this.showAviso('Erro ao editar dados pessoais e endereço!', 'warning', 'ui-1_bell-53');
      this.ngxLoader.stop();
      return false;
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

  verificaDocumentoCadastrado(tipoDoc: string) {
    if (tipoDoc == 'CPF') {
      this.docSelecionadoCPF = true;
    } else {
      this.docSelecionadoCPF = false;
    }
  }

  verificaDocumentoSelecionado(event: any) {
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
