import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type NoteBlockType = 'title' | 'paragraph' | 'list' | 'table' | 'image';

// block structure
export interface NoteBlockBase {
  type: NoteBlockType;
}

// title
export interface TitleBlock extends NoteBlockBase {
  type: 'title';
  content: string;       
}

// paragraph
export interface ParagraphBlock extends NoteBlockBase {
  type: 'paragraph';
  content: string;       
}

// list
export interface ListBlock extends NoteBlockBase {
  type: 'list';
  items: string[];       
}

// table
export interface TableBlock extends NoteBlockBase {
  type: 'table';
  headers: string[];     // header
  rows: string[][];      // data
}

export interface ImageBlock extends NoteBlockBase {
  type: 'image';
  url: string;
  caption?: string;
}

export type NoteBlock = TitleBlock | ParagraphBlock | ListBlock | TableBlock | ImageBlock;

// Note 
export interface Note {
  _id?: string;
  noteTitle: string;    
  blocks: NoteBlock[];   
  creator: string;
}

@Injectable({
  providedIn: 'root',
})

export class NoteService {
  private apiUrl = 'http://localhost:3000/notes';

  constructor(private http: HttpClient) { }

  // Get all Notes
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  // Get User's Notes
  getUserNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  // Get Single Note by Id
  getNoteById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  // Create a new Note
  createNote(newNote: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}`, newNote);
  }

  // Update Note
  updateNote(id: string, updates: Partial<Note>): Observable<Note> {
    return this.http
      .patch<{ message: string; note?: Note }>(
        `${this.apiUrl}/${id}`, updates
      )
      .pipe(map((res) => res.note ?? (res as any)));
  }

  // Delete Note
  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadImage(formData: FormData): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
