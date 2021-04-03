import { Routes } from '@angular/router';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { UserProfileComponent } from '../../modules/user-profile/user-profile.component';
import { UsuariosComponent } from '../../modules/usuarios/usuarios.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    {
        path: 'usuarios',
        component: UsuariosComponent,
        loadChildren: '../../modules/usuarios/usuarios.module#UsuariosModule'
    },
];
