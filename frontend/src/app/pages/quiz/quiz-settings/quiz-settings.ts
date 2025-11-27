import { Component } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { WordType, WordStatus, WordPartOfSpeech } from '../../../services/word.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../material/material/material-module';

@Component({
  selector: 'app-quiz-settings',
  imports: [MaterialModule],
  templateUrl: './quiz-settings.html',
  styleUrl: './quiz-settings.css',
})

export class QuizSettings {
  quizMode: 'spaced' | 'filter' | 'random' = 'spaced';

  limitOptions = [10, 20, 30];
  selectedLimit = 10;

  statusOptions: WordStatus[] = ['perfect', 'almost', 'notYet'];

  typeOptions: WordType[] = [
    "word", "idiom", "structure", "phrase"
  ];

  // フィルター用
  selectedStatuses: WordStatus[] = [];
  selectedTypes: WordType[] = [];

  constructor(
    private router: Router
  ) { }

  startQuiz() {
    const settings = {
      mode: this.quizMode,
      limit: this.selectedLimit,
      filter: {
        status: this.selectedStatuses,
        type: this.selectedTypes
      }
    };

    // 設定をクイズ画面へ渡す
    this.router.navigate(['/quiz/play'], {
      state: settings
    });
  }

  toggleStatus(status: WordStatus, checked: boolean) {
    if (checked) {
      if (!this.selectedStatuses.includes(status)) {
        this.selectedStatuses = [...this.selectedStatuses, status];
      }
    } else {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    }
  }

  toggleType(type: WordType, checked: boolean) {
    if (checked) {
      if (!this.selectedTypes.includes(type)) {
        this.selectedTypes = [...this.selectedTypes, type];
      }
    } else {
      this.selectedTypes = this.selectedTypes.filter(s => s !== status);
    }
  }

}
