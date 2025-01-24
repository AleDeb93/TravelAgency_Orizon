import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'account', component: UserComponent },
  {path: 'cart', component: CartComponent},
  {
    path: 'voyages',
    loadChildren: () => import('./voyages/voyages.module').then(m => m.VoyagesModule)
  },
  { path: '', redirectTo: 'voyages', pathMatch: 'full' }
];


const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  // scrollOffset: [0, 64],
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

