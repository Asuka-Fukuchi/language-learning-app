import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type WordType = "word" | "idiom" | "structure" | "phrase";

export type WordPartOfSpeech =
    "article" | "noun" | "pronoun" | "verb" | "auxiliary verb" |
    "adjective" | "adverb" | "preposition" | "conjunction" | "interjection";

export type WordStatus = "perfect" | "almost" | "notYet";

export interface ISpaced {
    repetitions?: number;
    interval?: number;
    nextReview?: Date;
    easiness?: number;
}
export interface Word {
  _id?: string;
  word: string;
  phoneticSymbols?: string;
  type: WordType;
  partOfSpeech?: WordPartOfSpeech;
  synonyms?: string[];
  antonyms?: string[];
  meaning: string;
  examples: string[];
  status: WordStatus;
  spaced?: ISpaced;
  creator: string;
}

export interface SimpleWordCard {
  word: string;
  phoneticSymbols?: string;
  partOfSpeech?: WordPartOfSpeech;
  meaning: string;
  status: WordStatus;
}

@Injectable({
  providedIn: 'root',
})

export class WordService {
  private apiUrl = 'http://localhost:3000/words';

  constructor(private http: HttpClient) { }

  // Get all Words
  getWords(): Observable<Word[]> {
    return this.http.get<Word[]>(this.apiUrl);
  }

  // Get User's words
  getUserWords(userId: string): Observable<Word[]> {
    return this.http.get<Word[]>(`http://localhost:3000/words?creator=${userId}`);
  }

  // Get Single Word by Id
  getWordById(id: string): Observable<Word> {
    return this.http.get<Word>(`${this.apiUrl}/${id}`);
  }

  // Create a new word
  createWord(newWord: Partial<Word>): Observable<Word> {
    return this.http.post<Word>(`${this.apiUrl}`, newWord);
  }

  // Update word
  updateWord(id: string, updates: Partial<Word>): Observable<Word> {
    return this.http
      .patch<{ message: string; word?: Word }>(
        `${this.apiUrl}/${id}`, updates
      )
      .pipe(map((res) => res.word ?? (res as any)));
  }

  // Delete Word
  deleteWord(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
