import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsList } from './words-list';

describe('WordsList', () => {
  let component: WordsList;
  let fixture: ComponentFixture<WordsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
