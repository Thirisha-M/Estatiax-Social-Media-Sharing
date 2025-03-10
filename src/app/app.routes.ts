import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home/home.component';
import { AuthGuard } from './services/auth.guard';

import { HeaderComponent } from './modules/home/header/header.component';
import { FooterComponent } from './modules/home/footer/footer.component';
import { LoginComponent } from './modules/authentication/login/login.component';
import { RegisterComponent } from './modules/authentication/register/register.component';
import { PostPropertyComponent } from './modules/property/post-property/post-property.component';
import { ListingsComponent } from './modules/property/listings/listings.component';
import { ViewPropertyComponent } from './modules/property/view-property/view-property.component';
import { SavedListingsComponent } from './modules/property/saved-listings/saved-listings.component';
import { SearchPropertyComponent } from './modules/property/search-property/search-property.component';
import { AboutComponent } from './modules/home/about/about.component';
import { ContactComponent } from './modules/home/contact/contact.component';
import { DashboardComponent } from './modules/home/dashboard/dashboard.component';
import { MyListingsComponent } from './modules/property/my-listings/my-listings.component';
import { FaqComponent } from './modules/home/faq/faq.component';
import { ServicesComponent } from './modules/home/services/services.component';
import { UpdateProfileComponent } from './modules/home/update-profile/update-profile.component';
import { RequestsComponent } from './modules/property/requests/requests.component';
import { UpdatePropertyComponent } from './modules/property/update-property/update-property.component';
import { ModalComponent } from './modules/property/modal/modal.component';


export const routes: Routes = [

  { path: '', component: HomeComponent },
  {path:'header',component:HeaderComponent},
  {path:'footer',component:FooterComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'listings',component:ListingsComponent,canActivate:[AuthGuard]},
  {path:'post-property',component:PostPropertyComponent,canActivate:[AuthGuard]},
  {path:'view-property/:id',component:ViewPropertyComponent,canActivate:[AuthGuard]},
  {path:'saved-listings',component:SavedListingsComponent,canActivate:[AuthGuard]},
  {path:'search-property',component:SearchPropertyComponent,canActivate:[AuthGuard]},
  {path:'about',component:AboutComponent},
  {path:'contact',component:ContactComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard]},
  {path:'my-listings',component:MyListingsComponent,canActivate:[AuthGuard]},
  {path:'faq',component:FaqComponent},
  {path:'services',component:ServicesComponent},
  {path:'update-profile',component:UpdateProfileComponent,canActivate:[AuthGuard]},
  {path:'requests',component:RequestsComponent,canActivate:[AuthGuard]},
  {path:'update-property',component:UpdatePropertyComponent},
  {path:'modal',component:ModalComponent},
  


];
