import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './servicios/auth.guard';
import { AuthReverseGuard } from './servicios/auth-reverse.guard'; // Nuevo guard para evitar acceso a login/registro cuando está autenticado
import { PostDetailPage } from './post-detail/post-detail.page';

const routes: Routes = [
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
    loadChildren: () => import('./revision/revision.module').then( m => m.RevisionPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'post-detail/:id',
    loadChildren: () => import('./post-detail/post-detail.module').then( m => m.PostDetailPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
