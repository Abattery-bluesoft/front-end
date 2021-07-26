import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean | undefined ;
  constructor( private authService:AuthService) { 
    this.isAuth = this.authService.isAuth$.getValue();
  }

  ngOnInit(): void {
  }
  logout(){
    this.authService.logout();
  }
}
