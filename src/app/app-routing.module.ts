
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ListComponent } from './components/list/list.component';
import { AddProfileComponent } from './components/add-profile/add-profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
    
    {
      path: '',
      component: AuthComponent,
    },
    {
        path: 'login',
        component: AuthComponent,
      },
      {
        path: 'signup',
        component: AuthComponent,
      },
      {
        path: 'list',
        component: ListComponent,
        canActivate:[AuthGuard],
      },
      {
        path: 'add-profile',
        component: AddProfileComponent,
      },
      { path: 'edit/:id', component: AddProfileComponent }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}
  