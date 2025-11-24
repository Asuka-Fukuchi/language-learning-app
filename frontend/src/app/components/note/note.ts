import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material/material/material-module';
import { Note } from '../../services/note.service';

@Component({
  selector: 'app-note-card',
  imports: [ MaterialModule ],
  templateUrl: './note.html',
  styleUrl: './note.css',
})

export class NoteCard {
  @Input() note: Note | null = null;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();

  constructor() { }
  ngOnInit(): void {
  }
}
