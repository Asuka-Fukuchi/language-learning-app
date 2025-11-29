import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService, Note, NoteBlock, NoteBlockType, TitleBlock, ParagraphBlock, ListBlock, TableBlock } from '../../../services/note.service';
import { NoteBlockComponent } from '../../../components/notes/note-block/note-block';

@Component({
  selector: 'app-edit-note',
  imports: [MaterialModule, NoteBlockComponent],
  templateUrl: './edit-note.html',
  styleUrl: './edit-note.css',
})

export class EditNote {
  note!: Note;
  loading = true;
  error: string | null = null;

  constructor(
    private noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const noteId = this.route.snapshot.paramMap.get('id')!;
    this.noteService.getNoteById(noteId).subscribe({
      next: note => {
        this.note = note;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load note';
        this.loading = false;
      }
    });
  }

  addBlock(type: NoteBlockType) {
    let newBlock: NoteBlock;
    switch (type) {
      case 'title':
        newBlock = { type: 'title', content: '' };
        break;
      case 'paragraph':
        newBlock = { type: 'paragraph', content: '' };
        break;
      case 'list':
        newBlock = { type: 'list', items: [''] };
        break;
      case 'table':
        newBlock = { type: 'table', headers: [''], rows: [['']] };
        break;
      case 'image':
        newBlock = { type: 'image', url: '', caption: '' };
        break;
    }
    this.note.blocks.push(newBlock);
  }

  removeBlock(block: NoteBlock) {
    this.note.blocks = this.note.blocks.filter(b => b !== block);
  }

  uploadImage(block: NoteBlock, file: File) {
    if (block.type !== 'image') return;

    const formData = new FormData();
    formData.append('image', file);

    this.noteService.uploadImage(formData).subscribe({
      next: res => block.url = res.url,
      error: () => alert('Failed to upload image')
    });
  }

  saveNote() {
    this.noteService.updateNote(this.note._id!, this.note).subscribe({
      next: note => this.router.navigate(['/notes', note._id]),
      error: () => this.error = 'Failed to save note'
    });
  }

  goBack() {
    if (this.note?._id) {
      this.router.navigate(['/notes', this.note._id]);
    } else {
      this.router.navigate(['/notes']);
    }
  }
}