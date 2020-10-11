import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuariosCreateComponent } from './usuarios-create/usuarios-create.component';
import { UsuariosEditComponent } from './usuarios-edit/usuarios-edit.component';
import { RouterModule } from '@angular/router';
import { UsuariosRoutes } from './usuarios.routing';
import { NgbModalModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UsuariosRoutes),
    NgbTooltipModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgxMaskModule.forChild(),
  ],
  declarations: [
    UsuariosComponent,
    UsuariosListComponent,
    UsuariosCreateComponent,
    UsuariosEditComponent
  ]
})
export class UsuariosModule { }
