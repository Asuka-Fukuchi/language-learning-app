import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material/material-module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WordService, Word, WordType, WordPartOfSpeech, WordStatus } from '../../../services/word.service';

@Component({
  selector: 'app-edit-word',
  imports: [ MaterialModule ],
  templateUrl: './edit-word.html',
  styleUrl: './edit-word.css',
})

export class EditWord {
form!: FormGroup;
  wordId!: string;
  loading = false;
  
  wordTypes: WordType[] = ['word','idiom','structure','phrase'];
  partOfSpeechList: WordPartOfSpeech[] = [
    'article','noun','pronoun','verb','auxiliary verb',
    'adjective','adverb','preposition','conjunction','interjection'
  ];
  statusList: WordStatus[] = ['perfect','almost','notYet'];

  constructor(
    private fb: FormBuilder,
    private wordService: WordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wordId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadWord();
  }

  initForm() {
    this.form = this.fb.group({
      word: ['', Validators.required],
      phoneticSymbols: [''],
      type: ['word', Validators.required],
      partOfSpeech: [''],
      meaning: ['', Validators.required],
      status: ['notYet', Validators.required],
      examples: this.fb.array([this.fb.control('')]),
      synonyms: this.fb.array([this.fb.control('')]),
      antonyms: this.fb.array([this.fb.control('')])
    });
  }

  get examples() { return this.form.get('examples') as FormArray; }
  get synonyms() { return this.form.get('synonyms') as FormArray; }
  get antonyms() { return this.form.get('antonyms') as FormArray; }

  loadWord() {
    this.loading = true;
    this.wordService.getWordById(this.wordId).subscribe({
      next: (w) => {
        this.form.patchValue({
          word: w.word,
          phoneticSymbols: w.phoneticSymbols,
          type: w.type,
          partOfSpeech: w.partOfSpeech,
          meaning: w.meaning,
          status: w.status
        });

        this.setFormArray(this.examples, w.examples);
        this.setFormArray(this.synonyms, w.synonyms);
        this.setFormArray(this.antonyms, w.antonyms);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  private setFormArray(array: FormArray, values?: string[]) {
    array.clear();
    if (values && values.length) {
      values.forEach(v => array.push(this.fb.control(v)));
    } else {
      array.push(this.fb.control(''));
    }
  }

  addExample() { this.examples.push(this.fb.control('')); }
  removeExample(i: number) { if (this.examples.length > 1) this.examples.removeAt(i); }

  addSynonym() { this.synonyms.push(this.fb.control('')); }
  removeSynonym(i: number) { if (this.synonyms.length > 1) this.synonyms.removeAt(i); }

  addAntonym() { this.antonyms.push(this.fb.control('')); }
  removeAntonym(i: number) { if (this.antonyms.length > 1) this.antonyms.removeAt(i); }

  submit() {
    if (this.form.invalid) return;

    const updatedWord: Partial<Word> = {
      ...this.form.value,
      examples: this.form.value.examples.filter((x: string) => x.trim() !== ''),
      synonyms: this.form.value.synonyms.filter((x: string) => x.trim() !== ''),
      antonyms: this.form.value.antonyms.filter((x: string) => x.trim() !== '')
    };

    this.wordService.updateWord(this.wordId, updatedWord).subscribe({
      next: () => this.router.navigate(['/words', this.wordId]),
      error: (err) => console.error(err)
    });
  }

  cancel() {
    this.router.navigate(['/words', this.wordId]);
  }
}
