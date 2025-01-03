import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoyagesRoutingModule } from './voyages-routing.module';
import { DestinationsComponent } from './destinations/destinations.component';
import { ExperienceComponent } from './experience/experience.component';
import { OffersComponent } from './offers/offers.component';
import { SingleDestinationComponent } from './destinations/single-destination/single-destination.component';


@NgModule({
  declarations: [
    DestinationsComponent,
    ExperienceComponent,
    OffersComponent,
    SingleDestinationComponent
  ],
  imports: [
    CommonModule,
    VoyagesRoutingModule
  ]
})
export class VoyagesModule { }
