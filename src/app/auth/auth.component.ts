import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public focus1: boolean = false;
  public focus2: boolean = false;
  public formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  login() {
    this.ngxLoader.start();

    this.authService.login(this.formLogin.value).subscribe((response) => {
      this.ngxLoader.stop();
      this.router.navigate(['dashboard']);
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.error.error === 'Usuário inativo!') {
        this.ngxLoader.stop();
        this.alertaLogin("Usuário inativo!");
      } else if (errorResponse.error.error === 'Não autorizado!') {
        this.ngxLoader.stop();
        this.alertaLogin("E-mail ou senha inválidos!");
      }
    });
  }

  alertaLogin(mensagem: string) {
    this.toastr.warning('<span class="now-ui-icons ui-1_bell-53"></span><b>Ops!</b> ' + mensagem, '', {
      timeOut: 8000,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-danger alert-with-icon",
      positionClass: 'toast-top-right'
    });
  }
}
