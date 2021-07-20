import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = environment.apiUrl;
  token: string | undefined;
  userId!: string;
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
    return new Promise((resole, reject) => {
      this.http
        .post(`${this.api}/users/signup`, { email: email, password: password })
        .subscribe({
          next: () => {
            //authentifier l'utilisateur
          },
          error: (error) => {
            reject(error);
          },
        });
    });
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
    return new Promise((resole, reject) => {
      this.http
        .post(`${this.api}/users/login`, { email: email, password: password })
        .subscribe({
          next: (data) => {},
          error: (error) => {
            reject(error);
          },
        });
    });
  }

  /**
   *
   *
   * @memberof AuthService
   */
  logOut() {}
}
