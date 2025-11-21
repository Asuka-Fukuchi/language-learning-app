import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface UserWordList {
  listTitle: string;
  words: string[];
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  lists?: UserWordList[];
  isAdmin: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private apiUrl = "http://localhost:3000/users";

  constructor(private http: HttpClient) { }

  // Get All Users for admin
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get single user by id
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Register
  createUser(newUser: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}`, newUser);
  }

  // Delete user by id
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Update User by ID
  updateUser(id: string, updates: Partial<User>): Observable<User> {
    return this.http
      .patch<{ message?: string; user?: User }>(`${this.apiUrl}/${id}`, updates)
      .pipe(map((res) => (res.user ? res.user : (res as any))));
  }

  // Login
  loginUser(credentials: {
    email: string;
    password: string;
  }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/login`,
      credentials
    );
  }
}
