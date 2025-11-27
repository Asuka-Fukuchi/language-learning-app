import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { Word } from '../../../services/word.service';
import { MaterialModule } from '../../../material/material/material-module';

interface QuizResult {
  word: string;
  meaning: string;
  correct: boolean;
  userAnswer: string;
}

@Component({
  selector: 'app-quiz-play',
  imports: [MaterialModule],
  templateUrl: './quiz-play.html',
  styleUrl: './quiz-play.css',
})

export class QuizPlay {
  quizMode: 'spaced' | 'filter' | 'random' = 'spaced';
  quizWords: Word[] = [];
  currentIndex = 0;
  userInput: string = '';
  results: QuizResult[] = [];
  settings: any;
  finished = false;

  displayedColumns: string[] = ['word', 'meaning', 'userAnswer', 'correct'];

  get correctCount(): number {
    return this.results ? this.results.filter(r => r.correct).length : 0;
  }

  get totalCount(): number {
    return this.results ? this.results.length : 0;
  }
  
  constructor(
    private router: Router,
    private quizService: QuizService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.settings = nav?.extras.state;
    if (!this.settings) {
      this.router.navigate(['/quiz']);
    }
  }

  ngOnInit() {
    if (!this.settings) return;

    this.quizMode = this.settings.mode; 

    const { mode, limit, filter } = this.settings;
    if (mode === 'spaced') {
      this.quizService.getSpacedQuizWords('me', limit).subscribe(words => this.quizWords = words);
    } else if (mode === 'filter') {
      this.quizService.getFilteredQuizWords('me', filter, limit).subscribe(words => this.quizWords = words);
    } else {
      this.quizService.getRandomQuizWords('me', limit).subscribe(words => this.quizWords = words);
    }
  }

  submitAnswer() {
    const word = this.quizWords[this.currentIndex];
    const isCorrect = word.word.trim().toLowerCase() === this.userInput.trim().toLowerCase();

    this.quizService.processQuizAnswer(word, isCorrect, this.quizMode).subscribe();

    this.results.push({
      word: word.word,
      meaning: word.meaning,
      correct: isCorrect,
      userAnswer: this.userInput
    });

    this.next();
  }

  next() {
    this.userInput = '';
    if (this.currentIndex < this.quizWords.length - 1) {
      this.currentIndex++;
    } else {
      this.finished = true;
    }
  }

  goBack() {
    this.router.navigate(['/quiz']);
  }
}