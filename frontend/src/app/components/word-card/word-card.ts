import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material/material/material-module';
import { SimpleWordCard } from '../../services/word.service';

@Component({
  selector: 'app-word-card',
  imports: [ MaterialModule ],
  templateUrl: './word-card.html',
  styleUrl: './word-card.css',
})
export class WordCard {
  @Input() word: SimpleWordCard | null = null;
}
