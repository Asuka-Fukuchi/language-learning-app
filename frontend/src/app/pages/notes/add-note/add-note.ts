import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, Note, NoteBlock, TitleBlock, ParagraphBlock, ListBlock, TableBlock, ImageBlock } from '../../../services/note.service';
import { MaterialModule } from '../../../material/material/material-module';
import { NoteBlockComponent } from '../../../components/notes/note-block/note-block';

@Component({
  selector: 'app-add-note',
  imports: [MaterialModule, NoteBlockComponent],
  templateUrl: './add-note.html',
  styleUrl: './add-note.css',
})

export class AddNote {
  noteTitle: string = '';
  blocks: NoteBlock[] = [];
  loading = false;
  error: string | null = null

  constructor(
    private noteService: NoteService,
    private router: Router
  ) { }

  addBlock(type: 'title' | 'paragraph' | 'list' | 'table' | 'image') {
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
    this.blocks.push(newBlock!);
  }

  addListItem(block: ListBlock) {
    block.items.push('');
  }

  removeListItem(block: ListBlock, index: number) {
    block.items.splice(index, 1);
  }

  addTableRow(block: TableBlock) {
    const newRow: string[] = block.headers.map(_ => '');
    block.rows.push(newRow);
  }

  addTableColumn(block: TableBlock) {
    block.headers.push('');
    block.rows.forEach(row => row.push(''));
  }

  removeTableRow(block: TableBlock, index: number) {
    block.rows.splice(index, 1);
  }

  removeTableColumn(block: TableBlock, index: number) {
    block.headers.splice(index, 1);
    block.rows.forEach(row => row.splice(index, 1));
  }

  removeBlock(index: number) {
    this.blocks.splice(index, 1);
  }

  uploadImage(block: NoteBlock, file: File) {
    if (block.type !== 'image') return;

    const formData = new FormData();
    formData.append('image', file);

    this.noteService.uploadImage(formData).subscribe({
      next: (res) => {
        block.url = res.url; 
        delete (block as any).file;
      },
      error: () => {
        alert("Failed to upload image");
      }
    });
  }

  saveNote() {
    if (!this.noteTitle.trim()) {
      this.error = 'Note title is required';
      return;
    }

    const preparedBlocks = this.blocks.map(block => {
      if (block.type === 'table') {
        return {
          ...block,
          headers: block.headers?.map(h => h || '') || [''],
          rows: block.rows?.map(row => row.map(cell => cell || '')) || [['']]
        };
      } else if (block.type === 'image') {
        const imageBlock: ImageBlock = {
          type: 'image', 
          url: block.url
        };
        return imageBlock;
      }
      return block;
    });

    this.loading = true;
    const newNote = {
      noteTitle: this.noteTitle,
      blocks: preparedBlocks
    };

    console.log('Saving note:', JSON.stringify(newNote, null, 2));

    this.noteService.createNote(newNote).subscribe({
      next: (note) => this.router.navigate(['/notes', note._id]),
      error: (err) => {
        console.error(err);
        this.error = 'Failed to create note';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/notes']);
  }

  cancel() {
    this.router.navigate(['/notes']);
  }

}