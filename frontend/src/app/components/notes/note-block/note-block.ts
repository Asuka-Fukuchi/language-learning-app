import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';

@Component({
  selector: 'app-note-block',
  imports: [ MaterialModule ],
  templateUrl: './note-block.html',
  styleUrl: './note-block.css',
})
export class NoteBlockComponent {
  @Input() block: any;
  @Input() editable: boolean = false;

  @Output() remove = new EventEmitter<void>();
  @Output() addListItem = new EventEmitter<void>();
  @Output() addTableRow = new EventEmitter<void>();
  @Output() addTableColumn = new EventEmitter<void>();
}
