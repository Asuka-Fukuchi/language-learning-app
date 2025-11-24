import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Note, NoteService } from '../../../services/note.service';
import { NoteCard } from '../../../components/note/note';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes-list',
  imports: [MaterialModule, NoteCard],
  templateUrl: './notes-list.html',
  styleUrl: './notes-list.css',
})
export class NotesList {
  submitted = false;
  errorMessage = '';
  notes: Note[] = [];
  editingNote: Note | null = null;
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private noteService: NoteService
  ) { }

  addNoteForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
  });

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }

      this.noteService.getUserNotes().subscribe(notes => {
        this.notes = notes;
      });
    });
  }

  get title() {
    return this.addNoteForm.get('title')!;
  }

  get description() {
    return this.addNoteForm.get('description')!;
  }

  getFormErrors(): string {
    for (const field in this.addNoteForm.controls) {
      const control = this.addNoteForm.get(field);
      if (control?.errors) {
        if (control.errors['required']) return `Fill in the ${field} field.`;
        if (control.errors['minlength']) return `${field} is too short.`;
      }
    }
    return '';
  }

  newNote(): void {
    if (!this.currentUser) return;
    if (!this.addNoteForm.valid) {
      this.errorMessage = this.getFormErrors();
      return;
    }

    const formValue = this.addNoteForm.value;

    const newNote: Note = {
      noteTitle: formValue.title ?? '',
      description: formValue.description ?? '',
      creator: this.currentUser._id ?? '',
    };

    this.noteService.createNote(newNote).subscribe({
      next: () => {
        alert('Note added successfully.'), (window.location.href = '/notes');
      },
      error: (err) => console.error('Error making flat:', err),
    });
  }

  editNoteForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(5)
    ]),
  });

  startEdit(note: Note) {
    this.editingNote = note;

    this.editNoteForm.setValue({
      title: note.noteTitle,
      description: note.description
    });
  }

  updateNote() {
    if (!this.editingNote) return;

    const updates = {
      noteTitle: this.editNoteForm.value.title!,
      description: this.editNoteForm.value.description!
    };

    this.noteService.updateNote(this.editingNote._id!, updates)
      .subscribe(updated => {
        Object.assign(this.editingNote!, updated);
        this.editingNote = null;
      });
  }

  deleteNote(note: Note) {
    this.noteService.deleteNote(note._id!).subscribe(() => {
      this.notes = this.notes.filter(n => n._id !== note._id);
    });
  }

}
