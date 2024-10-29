import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearpostPage } from './crearpost.page';

const routes: Routes = [
  {
    path: '',
    component: CrearpostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearpostPageRoutingModule {}
