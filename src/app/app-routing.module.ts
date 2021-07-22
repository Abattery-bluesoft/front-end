
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListComponent } from './components/list/list.component';
import { AddProfileComponent } from './components/add-profile/add-profile.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
    
    {
      path: '',
      component: LoginComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
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
  