import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './servicios/auth.guard';
import { AuthReverseGuard } from './servicios/auth-reverse.guard';
import { AdminAuthGuard } from './servicios/adminguard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [AuthReverseGuard]
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule),
    canActivate: [AuthReverseGuard]
  },
  {
    path: 'crearpost',
    loadChildren: () => import('./crearpost/crearpost.module').then(m => m.CrearpostPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'revision',
    loadChildren: () => import('./revision/revision.module').then(m => m.RevisionPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'detalle-publicacion/:id',
    loadChildren: () => import('./detalle-publicacion/detalle-publicacion.module').then(m => m.DetallePublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'modificar-publicacion/:id',
    loadChildren: () => import('./modificar-publicacion/modificar-publicacion.module').then(m => m.ModificarPublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule),
    canActivate: [AuthGuard]
  },  {
    path: 'editar-perfil',
    loadChildren: () => import('./editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },
  {
    path: 'ayuda-soporte',
    loadChildren: () => import('./ayuda-soporte/ayuda-soporte.module').then( m => m.AyudaSoportePageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
