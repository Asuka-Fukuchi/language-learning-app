import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWord } from './edit-word';

describe('EditWord', () => {
  let component: EditWord;
  let fixture: ComponentFixture<EditWord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
