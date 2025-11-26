import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Word, WordService } from '../../../services/word.service';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-words-list',
  imports: [MaterialModule],
  templateUrl: './words-list.html',
  styleUrl: './words-list.css',
})

export class WordsList {
  displayedColumns: string[] = ['word', 'phoneticSymbols', 'partOfSpeech', 'meaning', 'status'];
  dataSource = new MatTableDataSource<Word>([]);

  constructor(
    private router: Router,
    private authService: AuthService,
    private wordService: WordService
  ) { }

  ngOnInit() {
    const user = this.authService.currentUserSnapshot();
    if (user) {
      this.wordService.getUserWords(user._id!).subscribe(words => {
        this.dataSource.data = words;

        this.dataSource.filterPredicate = (data: Word, filter: string) => {
          const f = JSON.parse(filter);

          // search = word, meaning を含むか
          const matchSearch =
            !f.search ||
            data.word.toLowerCase().includes(f.search) ||
            data.meaning.toLowerCase().includes(f.search);

          // POS フィルタ
          const matchPos =
            !f.partOfSpeech ||
            data.partOfSpeech === f.partOfSpeech;

          // status フィルタ
          const matchStatus =
            !f.status ||
            data.status === f.status;

          return matchSearch && matchPos && matchStatus;
        };
      });
    }
  }

  filters = {
    search: '',
    partOfSpeech: '',
    status: ''
  };

  partOfSpeechList = [
    "article", "noun", "pronoun",
    "verb", "auxiliary verb",
    "adjective", "adverb", "preposition",
    "conjunction", "interjection"
  ];

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filters);
  }

  goToAddWord() {
    this.router.navigate(['/words/new']);
  }

  goToDetail(word: Word) {
    this.router.navigate(['/words', word._id]);
  }
}
