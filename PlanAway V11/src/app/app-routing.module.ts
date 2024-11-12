import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './servicios/auth.guard';
import { AuthReverseGuard } from './servicios/auth-reverse.guard'; // Nuevo guard para evitar acceso a login/registro cuando está autenticado
import { PostDetailPage } from './post-detail/post-detail.page';
import { AdminAuthGuard } from './servicios/adminguard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthReverseGuard] // Impedir acceso si ya está autenticado
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule),
    canActivate: [AuthReverseGuard] // Impedir acceso si ya está autenticado
  },
  {
    path: 'crearpost',
    loadChildren: () => import('./crearpost/crearpost.module').then( m => m.CrearpostPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'revision',
    loadChildren: () => import('./revision/revision.module').then( m => m.RevisionPageModule),
    canActivate: [AdminAuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'post-detail/:id',
    loadChildren: () => import('./post-detail/post-detail.module').then( m => m.PostDetailPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-publicacion/:id',
    loadChildren: () => import('./detalle-publicacion/detalle-publicacion.module').then( m => m.DetallePublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'modificar-publicacion/:id',
    loadChildren: () => import('./modificar-publicacion/modificar-publicacion.module').then( m => m.ModificarPublicacionPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
