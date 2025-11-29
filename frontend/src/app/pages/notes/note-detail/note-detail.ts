import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService, Note, NoteBlock } from '../../../services/note.service';
import { MaterialModule } from '../../../material/material/material-module';
import { NoteBlockComponent } from '../../../components/notes/note-block/note-block';

@Component({
  selector: 'app-note-detail',
  imports: [ MaterialModule,  NoteBlockComponent],
  templateUrl: './note-detail.html',
  styleUrl: './note-detail.css',
})
export class NoteDetail {
  note: Note | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadNote();
  }

  loadNote() {
    const noteId = this.route.snapshot.paramMap.get('id');
    if (!noteId) {
      this.error = 'Invalid note ID';
      return;
    }

    this.loading = true;
    this.noteService.getNoteById(noteId).subscribe({
      next: (note) => {
        this.note = note;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load note';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/notes']);
  }

  goToEditNote() {
    if (!this.note?._id) return;
    this.router.navigate([`/notes/edit/${this.note._id}`]);
  }

  deleteNote() {
    if (!this.note?._id) return;
    if (!confirm('Are you sure you want to delete this note?')) return;

    this.noteService.deleteNote(this.note._id).subscribe({
      next: () => {
        alert('Note deleted');
        this.router.navigate(['/notes']); 
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete note');
      }
    });
  }
}
