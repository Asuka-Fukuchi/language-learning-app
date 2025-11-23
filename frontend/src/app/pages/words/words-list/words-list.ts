import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Word, WordService } from '../../../services/word';
import { AuthService } from '../../../services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-words-list',
  imports: [ MaterialModule ],
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
      });
    }
  }

  filterValue: string = '';

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
