import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardPayload {
  totalWords: number;
  byStatus: { perfect: number; almost: number; notYet: number;[key: string]: number };
  recentWords: Array<{ _id: string; word: string; meaning?: string; status?: string; createdAt?: string }>;
  recentNotes: Array<{ _id: string; noteTitle?: string; excerpt?: string; createdAt?: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private api = 'http://localhost:3000/dashboard';

  constructor(
    private http: HttpClient
  ) { }

  getDashboard(): Observable<DashboardPayload> {
    return this.http.get<DashboardPayload>(this.api);
  }
}
