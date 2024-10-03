import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard'; // Importa el guard
import { AuthReverseGuard } from './services/auth-reverse.guard'; // Nuevo guard para evitar acceso a login/registro cuando está autenticado

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard] // Añade el guard aquí
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
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [AuthGuard] // Añade el guard aquí
  },
  {
    path: 'crear-post',
    loadChildren: () => import('./crear-post/crear-post.module').then( m => m.CrearPostPageModule),
    canActivate: [AuthGuard] // Añade el guard aquí
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then( m => m.PostsPageModule),
    canActivate: [AuthGuard] // Añade el guard aquí
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
