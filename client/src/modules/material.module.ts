import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatCard, MatCardModule } from '@angular/material/card';
import {
  MatSnackBarModule,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';


@NgModule({
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatListModule,
    MatRadioModule,
    MatCardModule,
    MatSnackBarModule,
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
  ],
  exports: [
    MatSidenavModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatListModule,
    MatRadioModule,
    MatCardModule,
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
  ]
})
export class MaterialModule { }
