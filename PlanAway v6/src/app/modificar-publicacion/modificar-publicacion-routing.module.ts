import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarPublicacionPage } from './modificar-publicacion.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarPublicacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarPublicacionPageRoutingModule {}
