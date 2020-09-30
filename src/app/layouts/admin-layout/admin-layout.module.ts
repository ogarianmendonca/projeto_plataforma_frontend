import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { UserProfileComponent } from '../../modules/user-profile/user-profile.component';
import { TableListComponent } from '../../modules/table-list/table-list.component';
import { UpgradeComponent } from '../../modules/upgrade/upgrade.component';
import { TypographyComponent } from '../../modules/typography/typography.component';
import { IconsComponent } from '../../modules/icons/icons.component';
import { NotificationsComponent } from '../../modules/notifications/notifications.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forChild()
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
  ]
})

export class AdminLayoutModule {}
