import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

import {Injectable} from '@angular/core';
import {Http,
        Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {CreateUserResponse} from '../models/server-response/create-user-response.model';
import {GetUserByIdResponse} from '../models/server-response/get-user-by-id-response';
import {LoginUserResponse} from '../models/server-response/login-user-response';
import {User} from '../models/user.model';

@Injectable()
export class UserService {
  baseUrl = '/webservice/rest/users';
  currentUser: User;


  constructor(private http: Http) {
    this.updateCurrentUserWithSessionStorage()
  }

  getUsers(): Observable<any> {
    return this.http
        .get(this.baseUrl)
        .map((res: Response) => res.json());
  }

  getUserById(id: number): Observable<GetUserByIdResponse> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
        .get(url)
        .map((res: Response) => res.json());
  }

  createUser(user: User): Observable<CreateUserResponse> {
    return this.http
        .post(this.baseUrl, user)
        .map((res: Response) => res.json());
  }

  deleteUserById(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
        .delete(url)
        .map((res: Response) => res.json());
  }

  updateUserById(id: number, user: User): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
        .put(url, user)
        .map((res: Response) => res.json());
  }

  loginUser(info: {email: string, password: string}): Observable<LoginUserResponse> {
    const url = `${this.baseUrl}/login`;
    return this.http
        .post(url, info)
        .map((res: Response) => res.json());
  }

  updateCurrentUserWithSessionStorage(): void {
    const userId = sessionStorage.getItem('userId');
    // check if the value, 'id', is a number.
    const isValidId = !isNaN(parseInt(userId, 10));
    console.log('userId:', userId);
    if (isValidId) {
      const userIdAsNumber = parseInt(userId, 10);
      this.getUserById(userIdAsNumber)
          .subscribe((res: GetUserByIdResponse) => {
            if (res.success) {
              this.currentUser = res.user;
              console.log('current user:', this.currentUser);
            } else {
              this.currentUser = null;
              console.log('error with retrieving session user. user set to null');
            }
          })
    } else {
      console.log('no user stored in session');
    }
  }

  setCurrentUser(user: User): void {
    if (user == null) {
      return;
    }
    const userIdString = user.id.toString();
    this.currentUser = user;
    this.setSessionUserId(userIdString);
  }

  setSessionUserId(id: string): void {
    sessionStorage.setItem('userId', id);
  }

  logout(): void {
    this.currentUser = null;
    this.setSessionUserId(null);
  }
}
