import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type NoteBlockType = 'title' | 'paragraph' | 'list' | 'table';

// 各ブロックの構造
export interface NoteBlockBase {
  type: NoteBlockType;
}

// タイトルブロック
export interface TitleBlock extends NoteBlockBase {
  type: 'title';
  content: string;       // タイトル文字列
}

// 段落ブロック
export interface ParagraphBlock extends NoteBlockBase {
  type: 'paragraph';
  content: string;       // 段落本文
}

// リストブロック
export interface ListBlock extends NoteBlockBase {
  type: 'list';
  items: string[];       // 箇条書きの項目
}

// 表ブロック
export interface TableBlock extends NoteBlockBase {
  type: 'table';
  headers: string[];     // 列名
  rows: string[][];      // 行のデータ
}

// NoteBlock は上記のいずれか
export type NoteBlock = TitleBlock | ParagraphBlock | ListBlock | TableBlock;

// Note 全体
export interface Note {
  _id?: string;
  noteTitle: string;     // ノート全体のタイトル
  blocks: NoteBlock[];   // ブロック単位で内容を管理
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
