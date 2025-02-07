import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/user/login/login.component';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account', component: UserComponent },
  { path: 'account/login', component: LoginComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthService] },
  {
    path: 'voyages',
    loadChildren: () => import('./voyages/voyages.module').then(m => m.VoyagesModule)
  },
  { path: '', redirectTo: 'voyages', pathMatch: 'full' }
];


const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

