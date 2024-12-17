import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './FixUP/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './FixUP/login/login.component';
import { HomeComponent } from './FixUP/home/home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { SupportLoginComponent } from './support-login/support-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { SupportDashboardComponent } from './support-dashboard/support-dashboard.component';
import { JwtModule } from '@auth0/angular-jwt'; // Import the JwtModule
import { AdminGuard } from './Auth guards/admin.guard';
import { Chart } from 'chart.js/dist/core/core.plugins';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import { SupportRegisterComponent } from './support-register/support-register.component';
import { TicketComponent } from './ticket/ticket.component';
import { ChatComponent } from './chat/chat.component';
import { StatusComponent } from './status/status.component';
import { CustomSolutionComponent } from './custom-solution/custom-solution.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    AdminLoginComponent,
    UserLoginComponent,
    SupportLoginComponent,
    AdminDashboardComponent,
    UserDashboardComponent,
    SupportDashboardComponent,
    UserDetailsComponent,
    AdminRegisterComponent,
    SupportRegisterComponent,
    TicketComponent,
    ChatComponent,
    StatusComponent,
    CustomSolutionComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    
    JwtModule.forRoot({ // Initialize JwtModule
      config: {
        tokenGetter: () => localStorage.getItem('jwt'), // Token getter function
        allowedDomains: ['localhost:5000','localhost:5001'], // API domain where the JWT is valid
        disallowedRoutes: [] // Optionally, define routes to exclude from JWT authentication
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
