import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWord } from './add-word';

describe('AddWord', () => {
  let component: AddWord;
  let fixture: ComponentFixture<AddWord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
