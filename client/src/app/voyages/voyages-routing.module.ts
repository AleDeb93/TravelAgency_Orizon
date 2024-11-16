import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationsComponent } from './destinations/destinations.component';
import { ExperienceComponent } from './experience/experience.component';
import { OffersComponent } from './offers/offers.component';

const routes: Routes = [
  { path: 'destinations', component: DestinationsComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'offers', component: OffersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoyagesRoutingModule { }
