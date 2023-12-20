import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AppRoutingModule } from './app-routing.module';

// Component
import { AppComponent } from './app.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailStandardComponent } from './pages/detail-standard/detail-standard.component';
import { AboutComponent } from './pages/about/about.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DownloadComponent } from './pages/download/download.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HistoryComponent } from './pages/history/history.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { ConfirmDialogComponent } from './layouts/confirm-dialog/confirm-dialog.component';
import { RecoveryPasswordComponent } from './pages/recovery-password/recovery-password.component';
import { ResetComponent } from './pages/reset/reset.component';
import { EducationComponent } from './layouts/education/education.component';
import { ExperienceComponent } from './layouts/experience/experience.component';
import { LinkComponent } from './layouts/link/link.component';
import { PortfolioInformationComponent } from './pages/portfolio-information/portfolio-information.component';
import { SpiderchartComponent } from './layouts/spiderchart/spiderchart.component';
import { DatachartComponent } from './layouts/datachart/datachart.component';

// Module
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MatDialogModule } from '@angular/material/dialog';
import { MessagesModule } from 'primeng/messages';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import {MatMenuModule} from '@angular/material/menu';
import { ReferenceComponent } from './pages/reference/reference.component';
import { QuickSidebarComponent } from './layouts/quick-sidebar/quick-sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    PortfolioComponent,
    DetailStandardComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DownloadComponent,
    HistoryComponent,
    ResetPasswordComponent,
    ConfirmDialogComponent,
    RecoveryPasswordComponent,
    ResetComponent,
    EducationComponent,
    ExperienceComponent,
    LinkComponent,
    PortfolioInformationComponent,
    SpiderchartComponent,
    DatachartComponent,
    ReferenceComponent,
    QuickSidebarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    InputTextModule,
    ConfirmPopupModule,
    MatDialogModule,
    MessagesModule,
    NgbPaginationModule,
    MatMenuModule,
    NgxPaginationModule,
    NgApexchartsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
