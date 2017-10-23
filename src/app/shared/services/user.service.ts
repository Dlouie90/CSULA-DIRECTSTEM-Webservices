import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {  User } from '../models/user.model';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';
import { CreateUserResponse } from '../models/server-response/create-user-response.model';
import { LoginUserResponse } from '../models/server-response/login-user-response';

@Injectable()
export class UserService {
    baseUrl = 'http://localhost:8080/webservice/rest/users';

    constructor(private http: Http) { }

    getUsers(): Observable<any> {
        return this.http
            .get(this.baseUrl)
            .map((res: Response) => res.json())
    }

    getUserById(id: number): Observable<any> {
        const url = `${ this.baseUrl }/${ id }`;
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
        const url = `${ this.baseUrl }/${ id }`;
        return this.http
            .delete(url)
            .map((res: Response) => res.json());
    }

    updateUserById(id: number, user: User): Observable<any> {
        const url = `${ this.baseUrl }/${id}`;
        return this.http
            .put(url, user)
            .map((res: Response) => res.json());
    }

    loginUser(info: { email: string, password: string }): Observable<LoginUserResponse> {
        const url = `${ this.baseUrl }/login`;
        return this.http
            .post(url, info)
            .map((res: Response) => res.json());
    }

}
