import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';

@Component({
  selector: 'app-note-block',
  imports: [MaterialModule],
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
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageSelected = new EventEmitter<File>();

  updateContent(event: any) {
    this.block.content = event.target.innerText;
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.imageUploaded.emit(reader.result as string);
    reader.readAsDataURL(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.imageSelected.emit(file);

    // ローカルプレビュー
    const reader = new FileReader();
    reader.onload = () => {
      this.block.url = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
