import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DestinationsComponent } from './voyages/destinations/destinations.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'voyages',
    loadChildren: () => import('./voyages/voyages.module').then(m => m.VoyagesModule)
  },
  {path: '', redirectTo: './voyages/destinations', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
