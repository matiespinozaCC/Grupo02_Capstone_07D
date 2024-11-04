import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearpostPageRoutingModule } from './crearpost-routing.module';

import { CrearpostPage } from './crearpost.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearpostPageRoutingModule
  ],
  declarations: [CrearpostPage]
})
export class CrearpostPageModule {}
