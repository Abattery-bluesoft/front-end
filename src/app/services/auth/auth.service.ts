import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = environment.apiUrl;
  token: string | null | undefined;
  userId: string | null | undefined;
  isAuth$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  /**
   *
   *
   * @param {string} email
   * @param {string} password
   * @return {*}
   * @memberof AuthService
   */
  signUp(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.api}/users/signup`, { email: email, password: password })
        .subscribe((signUpData:any)=>{
          if(signUpData.status === 201){
            this.login(email,password)
            .then(()=> resolve(true))
            .catch((err)=>reject(err))
            ;
          } else {
            reject(signUpData.message);
          }
        }),
        (err: any)=>{
          reject(err);
        }
    })
  }

  /**
   *
   *
   * @param {string} email
   * @param {string} password
   * @return {*}
   * @memberof AuthService
   */
  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.api}users/login`, { email: email, password: password })
        .subscribe((authData:any) => {
          console.log(authData);
          this.token = authData.token;
          this.userId= authData.userId;
          this.isAuth$.next(true);
          resolve(true);
        }),
        (err: any)=>{
          reject(err);
        }
    })
  }

  /**
   *
   *
   * @memberof AuthService
   */
  logOut() {
    this.isAuth$.next(false);
    this.userId = null;
    this.token = null;
  }
}
