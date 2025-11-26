import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBlock } from './note-block';

describe('NoteBlock', () => {
  let component: NoteBlock;
  let fixture: ComponentFixture<NoteBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteBlock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteBlock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
