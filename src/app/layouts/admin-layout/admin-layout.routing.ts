import { Routes } from '@angular/router';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { UserProfileComponent } from '../../modules/user-profile/user-profile.component';
import { TableListComponent } from '../../modules/table-list/table-list.component';
import { TypographyComponent } from '../../modules/typography/typography.component';
import { IconsComponent } from '../../modules/icons/icons.component';
import { NotificationsComponent } from '../../modules/notifications/notifications.component';
import { UpgradeComponent } from '../../modules/upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent }
];
