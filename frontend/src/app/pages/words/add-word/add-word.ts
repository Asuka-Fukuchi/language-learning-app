import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../material/material/material-module';
import { Word, WordService } from '../../../services/word.service';

@Component({
  selector: 'app-add-word',
  imports: [ MaterialModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './add-word.html',
  styleUrl: './add-word.css',
})

export class AddWord {

  form: FormGroup;

  wordTypes = ["word", "idiom", "structure", "phrase"];
  partOfSpeechList = [
    "article", "noun", "pronoun", "verb", "auxiliary verb",
    "adjective", "adverb", "preposition", "conjunction", "interjection"
  ];
  statusList = ["perfect", "almost", "notYet"];

  constructor(
    private fb: FormBuilder,
    private wordService: WordService,
    private router: Router
  ) {

    this.form = this.fb.group({
      word: ['', Validators.required],
      phoneticSymbols: [''],
      type: ['word', Validators.required],
      partOfSpeech: [''],
      meaning: ['', Validators.required],
      status: ['notYet', Validators.required],

      examples: this.fb.array([this.fb.control('')]),
      synonyms: this.fb.array([this.fb.control('')]),
      antonyms: this.fb.array([this.fb.control('')]),
    });
  }

  addExample() {
    this.examples.push(this.fb.control(''));
  }

  removeExample(i: number) {
    this.examples.removeAt(i);
  }

  addSynonym() {
    this.synonyms.push(this.fb.control(''));
  }

  removeSynonym(i: number) {
    this.synonyms.removeAt(i);
  }

  addAntonym() {
    this.antonyms.push(this.fb.control(''));
  }

  removeAntonym(i: number) {
    this.antonyms.removeAt(i);
  }

  get examples(): FormArray {
    return this.form.get('examples') as FormArray;
  }
  get synonyms(): FormArray {
    return this.form.get('synonyms') as FormArray;
  }
  get antonyms(): FormArray {
    return this.form.get('antonyms') as FormArray;
  }

  submit() {
    if (this.form.invalid) return;

    const word: Word = {
      ...this.form.value,
      creator: "TODO_user_id_here"  // 後でログイン情報を設定
    };

    word.examples = word.examples.filter((x: string) => x.trim() !== '');
    word.synonyms = (word.synonyms ?? []).filter((x: string) => x.trim() !== '');
    word.antonyms = (word.antonyms ?? []).filter((x: string) => x.trim() !== '');

    this.wordService.createWord(word).subscribe(() => {
      this.router.navigate(['/words']);
    });
  }
  
  cancel() {
    this.router.navigate(['/words']);
  }
}
