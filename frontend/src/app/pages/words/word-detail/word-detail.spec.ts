import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDetail } from './word-detail';

describe('WordDetail', () => {
  let component: WordDetail;
  let fixture: ComponentFixture<WordDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
