import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './FixUP/home/home.component';
import { LoginComponent } from './FixUP/login/login.component';
import { RegisterComponent } from './FixUP/register/register.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { SupportLoginComponent } from './support-login/support-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './Auth guards/admin.guard';
import { SupportGuard } from './Auth guards/support.guard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserGuard } from './Auth guards/user.guard';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { SupportRegisterComponent } from './support-register/support-register.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { TicketComponent } from './ticket/ticket.component';
import { ChatComponent } from './chat/chat.component';
import { StatusComponent } from './status/status.component';
import { CustomSolutionComponent } from './custom-solution/custom-solution.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'user-login', component: UserLoginComponent },
  { path: 'support-login', component: SupportLoginComponent },
  {path:'user-details',component:UserDetailsComponent, canActivate: [AdminGuard]},
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard]  // Protect the Admin Dashboard route
  },
  {
    path: 'User-dashboard',
    component:UserDashboardComponent,
    canActivate: [UserGuard]  // Protect the Admin Dashboard route
  }, 
  {
    path: 'Custom-Solution',
    component:CustomSolutionComponent,
    canActivate: [UserGuard]  // Protect the Admin Dashboard route
  },
  {
    path: 'Chat',
    component:ChatComponent,
    canActivate: [UserGuard]  // Protect the Admin Dashboard route
  },
  {
    path: 'Status',
    component:StatusComponent,
    canActivate: [UserGuard]  // Protect the Admin Dashboard route
  },
  {
    path: 'Ticket',
    component:TicketComponent,
    canActivate: [UserGuard]  // Protect the Admin Dashboard route
  },
  {
    path: 'Add-Admin',
    component:AdminRegisterComponent,
    canActivate: [AdminGuard]  // Protect the Admin Dashboard route
  },
  {
    path: 'Add-Support',
    component:SupportRegisterComponent,
    canActivate:[AdminGuard] // Protect the Admin Dashboard route
  },
  {
    path: 'support-dashboard',
    component: SupportDashboardComponent,
    canActivate: [SupportGuard]  // Protect the Admin Dashboard route
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
