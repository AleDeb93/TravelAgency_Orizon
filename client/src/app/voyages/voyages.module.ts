import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../modules/shared.modules'; 
import { MaterialModule } from '../../modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { VoyagesRoutingModule } from './voyages-routing.module';
import { DestinationsComponent } from './destinations/destinations.component';
import { ExperienceComponent } from './experience/experience.component';
import { SingleDestinationComponent } from './destinations/single-destination/single-destination.component';


@NgModule({
  declarations: [
    DestinationsComponent,
    ExperienceComponent,
    SingleDestinationComponent
  ],
  imports: [
    CommonModule,
    VoyagesRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class VoyagesModule { }
