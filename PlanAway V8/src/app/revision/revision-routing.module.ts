import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevisionPage } from './revision.page';

const routes: Routes = [
  {
    path: '',
    component: RevisionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisionPageRoutingModule {}
