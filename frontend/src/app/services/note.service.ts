import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Note {
  _id?: string;
  noteTitle: string;
  description: string;
  creator: string;
}

@Injectable({
  providedIn: 'root',
})

export class NoteService {
  private apiUrl = 'http://localhost:3000/notes';

  constructor(private http: HttpClient) { }

  // Get all Words
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  // Get User's words
  getUserNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  // Get Single Word by Id
  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  // Create a new word
  createNote( newNote: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}`, newNote);
  }

  // Update word
  updateNote(id: string, updates: Partial<Note>): Observable<Note> {
    return this.http
      .patch<{ message: string; note?: Note }>(
        `${this.apiUrl}/${id}`, updates
      )
      .pipe(map((res) => res.note ?? (res as any)));
  }

  // Delete Word
  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
