import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, Note, NoteBlock, TitleBlock, ParagraphBlock, ListBlock, TableBlock } from '../../../services/note.service';
import { MaterialModule } from '../../../material/material/material-module';

@Component({
  selector: 'app-add-note',
  imports: [MaterialModule],
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

  // ブロック追加
  addBlock(type: 'title' | 'paragraph' | 'list' | 'table') {
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

  // ノート保存
  saveNote() {
  if (!this.noteTitle.trim()) {
    this.error = 'Note title is required';
    return;
  }

  // テーブルブロックを整形（undefined を空文字に変換）
  const preparedBlocks = this.blocks.map(block => {
    if (block.type === 'table') {
      return {
        ...block,
        headers: block.headers?.map(h => h || '') || [''],
        rows: block.rows?.map(row => row.map(cell => cell || '')) || [['']]
      };
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



}