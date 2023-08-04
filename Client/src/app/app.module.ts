import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './layouts/toolbar/toolbar.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { DetailStandardComponent } from './pages/detail-standard/detail-standard.component';
import { SkillComponent } from './pages/skill/skill.component';
import { AddInformationComponent } from './pages/add-information/add-information.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DownloadComponent } from './pages/download/download.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarouselModule } from './carousel/carousel.module';
import { HistoryComponent } from './pages/history/history.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    DetailStandardComponent,
    SkillComponent,
    AddInformationComponent,
    AboutComponent,
    ContactComponent,
    PortfolioComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DownloadComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    CarouselModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
