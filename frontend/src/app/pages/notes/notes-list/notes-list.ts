import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { Note, NoteService } from '../../../services/note.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes-list',
  imports: [MaterialModule],
  templateUrl: './notes-list.html',
  styleUrl: './notes-list.css',
})
export class NotesList {
  notes: Note[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private noteService: NoteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes() {
    this.loading = true;
    this.noteService.getUserNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'failed to get note';
        this.loading = false;
      }
    });
  }

  goToAddNote() {
    this.router.navigate(['/notes/new']);
  }

  goToNoteDetail(noteId: string) {
    this.router.navigate(['/notes', noteId]);
  }

  deleteNote(noteId: string) {
    if (!confirm('Delete this note?')) return;
    this.noteService.deleteNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(n => n._id !== noteId);
      },
      error: (err) => console.error(err)
    });
  }
}