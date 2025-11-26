import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService, Note, NoteBlock, NoteBlockType, TitleBlock, ParagraphBlock, ListBlock, TableBlock } from '../../../services/note.service';


@Component({
  selector: 'app-edit-note',
  imports: [MaterialModule],
  templateUrl: './edit-note.html',
  styleUrl: './edit-note.css',
})

export class EditNote {
  noteId!: string;
  note!: Note;
  loading = true;
  error: string | null = null;

  form!: FormGroup;
  blocks!: FormArray;

  constructor(
    private noteService: NoteService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.noteId = this.route.snapshot.paramMap.get('id')!;
    this.loadNote();
  }

  private loadNote() {
    this.noteService.getNoteById(this.noteId).subscribe({
      next: note => {
        this.note = note;
        this.initForm();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load note.';
        this.loading = false;
      }
    });
  }

  private initForm() {
    this.blocks = this.fb.array(
      this.note.blocks.map(block => this.createBlockFormGroup(block))
    );

    this.form = this.fb.group({
      noteTitle: [this.note.noteTitle, Validators.required],
      blocks: this.blocks
    });
  }

  // 型ガード
  isContentBlock(block: NoteBlock): block is TitleBlock | ParagraphBlock {
    return block.type === 'title' || block.type === 'paragraph';
  }

  isListBlock(block: NoteBlock): block is ListBlock {
    return block.type === 'list';
  }

  isTableBlock(block: NoteBlock): block is TableBlock {
    return block.type === 'table';
  }

  createBlockFormGroup(block: NoteBlock): FormGroup {
    switch (block.type) {
      case 'title':
      case 'paragraph':
        return this.fb.group({
          type: [block.type, Validators.required],
          content: [block.content, Validators.required]
        });
      case 'list':
        return this.fb.group({
          type: [block.type, Validators.required],
          items: this.fb.array(block.items.map(item => this.fb.control(item, Validators.required)))
        });
      case 'table':
        return this.fb.group({
          type: [block.type, Validators.required],
          headers: this.fb.array(block.headers.map(h => this.fb.control(h, Validators.required))),
          rows: this.fb.array(
            block.rows.map(row => this.fb.array(row.map(cell => this.fb.control(cell, Validators.required))))
          )
        });
      default:
        throw new Error('Unknown block type');
    }
  }

  getBlockItems(blockIndex: number): FormArray {
    return this.blocks.at(blockIndex).get('items') as FormArray;
  }

  getTableHeaders(blockIndex: number): FormArray {
    return this.blocks.at(blockIndex).get('headers') as FormArray;
  }

  getTableRows(blockIndex: number): FormArray {
    return this.blocks.at(blockIndex).get('rows') as FormArray;
  }

  addListItem(blockIndex: number) {
    this.getBlockItems(blockIndex).push(this.fb.control('', Validators.required));
  }

  removeListItem(blockIndex: number, itemIndex: number) {
    this.getBlockItems(blockIndex).removeAt(itemIndex);
  }

  addTableHeader(blockIndex: number) {
    this.getTableHeaders(blockIndex).push(this.fb.control('', Validators.required));
  }

  removeTableHeader(blockIndex: number, headerIndex: number) {
    this.getTableHeaders(blockIndex).removeAt(headerIndex);
  }

  addTableRow(blockIndex: number) {
    const rowLength = this.getTableHeaders(blockIndex).length;
    const newRow = this.fb.array(Array(rowLength).fill('').map(cell => this.fb.control(cell, Validators.required)));
    this.getTableRows(blockIndex).push(newRow);
  }

  removeTableRow(blockIndex: number, rowIndex: number) {
    this.getTableRows(blockIndex).removeAt(rowIndex);
  }

  saveNote() {
    if (this.form.invalid) return;

    const updatedNote: Partial<Note> = this.form.value;
    this.noteService.updateNote(this.noteId, updatedNote).subscribe({
      next: note => this.router.navigate(['/notes', note._id]),
      error: () => this.error = 'Failed to save note.'
    });
  }

  goBack() {
    this.router.navigate(['/notes', this.noteId]);
  }

  getTableRowControls(blockIndex: number, rowIndex: number): FormControl[] {
  return (this.getTableRows(blockIndex).at(rowIndex) as FormArray).controls as FormControl[];
}
}