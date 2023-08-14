import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { SkillComponent } from './pages/skill/skill.component';
import { AddInformationComponent } from './pages/add-information/add-information.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DownloadComponent } from './pages/download/download.component';
import { HistoryComponent } from './pages/history/history.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { DetailStandardComponent } from './pages/detail-standard/detail-standard.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'search', component: SearchComponent},
  {path:'skill', component: SkillComponent},
  {path:'add-information', component: AddInformationComponent},
  {path:'about', component: AboutComponent},
  {path:'contact', component: ContactComponent},
  {path:'profile', component: ProfileComponent},
  {path:'portfolio', component: PortfolioComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'download', component: DownloadComponent},
  {path:'history', component: HistoryComponent},
  {path:'reset-password', component: ResetPasswordComponent},
  {path:'detail-standard', component: DetailStandardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
