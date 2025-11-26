import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { ActivatedRoute, Router } from '@angular/router';
import { Word, WordService } from '../../../services/word.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-word-detail',
  imports: [ MaterialModule ],
  templateUrl: './word-detail.html',
  styleUrl: './word-detail.css',
})
export class WordDetail {
  word?: Word;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private wordService: WordService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.wordService.getWordById(id).subscribe(w => this.word = w);
    }
  }

  goToEdit() {
    if (!this.word?._id) return;
    this.router.navigate([`/words/edit/${this.word._id}`]);
  }
}
