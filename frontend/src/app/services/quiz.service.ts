import { Injectable } from '@angular/core';
import { Word, WordService, ISpaced, WordType, WordStatus, WordPartOfSpeech } from './word.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class QuizService {
  private readonly REVIEW_INTERVALS = [3, 7, 14, 30];

  constructor(
    private wordService: WordService
  ) { }
  // ============================================================
  // 1. 記憶ベース（Spaced）クイズ
  // ============================================================
  getSpacedQuizWords(userId: string, limit: number): Observable<Word[]> {
    const today = new Date();

    return this.wordService.getUserWords(userId).pipe(
      map(words => {
        const spacedWords = words.filter(w => {
          const next = w.spaced?.nextReview ? new Date(w.spaced.nextReview) : null;
          return !next || next <= today;
        });

        return this.limitWords(spacedWords, limit);
      })
    );
  }

  // ============================================================
  // 2. フィルタークイズ
  // ============================================================
  getFilteredQuizWords(
    userId: string,
    filters: {
      status?: WordStatus[];
      partOfSpeech?: WordPartOfSpeech[];
      type?: WordType[];
    },
    limit: number
  ): Observable<Word[]> {
    return this.wordService.getUserWords(userId).pipe(
      map(words => {
        const filtered = words.filter(word => {
          let ok = true;

          if (filters.status?.length) {
            ok = ok && filters.status.includes(word.status);
          }
          if (filters.partOfSpeech?.length) {
            ok = ok && filters.partOfSpeech.includes(word.partOfSpeech!);
          }
          if (filters.type?.length) {
            ok = ok && filters.type.includes(word.type);
          }

          return ok;
        });

        return this.limitWords(filtered, limit);
      })
    );
  }

  // ============================================================
  // 3. 完全ランダムクイズ
  // ============================================================
  getRandomQuizWords(userId: string, limit: number = 20): Observable<Word[]> {
    return this.wordService.getUserWords(userId).pipe(
      map(words => {
        const shuffled = this.shuffle(words);
        return this.limitWords(shuffled, limit);
      })
    );
  }

  private shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  private limitWords(words: Word[], limit: number): Word[] {
    const count = Math.min(words.length, limit);
    return words.slice(0, count);
  }

  // ============================================================
  // Spaced（忘却曲線）アルゴリズム
  // ============================================================
  updateSpaced(spaced: ISpaced | undefined, isCorrect: boolean): ISpaced {
    if (!spaced) {
      spaced = {
        repetitions: 0,
        interval: 0,
        nextReview: new Date(),
        easiness: 2.5
      };
    }

    let reps = spaced.repetitions ?? 0;

    if (isCorrect) {
      reps = Math.min(reps + 1, this.REVIEW_INTERVALS.length);
    } else {
      reps = Math.max(reps - 1, 0);
    }

    const interval = reps === 0 ? 0 : this.REVIEW_INTERVALS[reps - 1];

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return {
      repetitions: reps,
      interval: interval,
      nextReview: nextReview,
      easiness: spaced.easiness ?? 2.5
    };
  }

  // ============================================================
  // 回答処理（どの出題方式でも spaced を更新）
  // ============================================================
  processQuizAnswer(word: Word, isCorrect: boolean): Observable<Word> {
    const updatedSpaced = this.updateSpaced(word.spaced, isCorrect);

    return this.wordService.updateWord(word._id!, {
      spaced: updatedSpaced,
      status: isCorrect ? 'almost' : 'notYet', // ここは任意で変更可能
    });
  }
}