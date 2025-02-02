import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationsComponent } from './destinations/destinations.component';
import { ExperienceComponent } from './experience/experience.component';
import { SingleDestinationComponent } from './destinations/single-destination/single-destination.component';


const routes: Routes = [
  { path: 'destinations', component: DestinationsComponent },
  { path: 'destinations/:id', component: SingleDestinationComponent },
  { path: 'experience', component: ExperienceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoyagesRoutingModule { }
