import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarPublicacionPageRoutingModule } from './modificar-publicacion-routing.module';

import { ModificarPublicacionPage } from './modificar-publicacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarPublicacionPageRoutingModule
  ],
  declarations: [ModificarPublicacionPage]
})
export class ModificarPublicacionPageModule {}
