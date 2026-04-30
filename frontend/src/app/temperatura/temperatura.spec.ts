import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Temperatura } from './temperatura';

describe('Temperatura', () => {
  let component: Temperatura;
  let fixture: ComponentFixture<Temperatura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Temperatura],
    }).compileComponents();

    fixture = TestBed.createComponent(Temperatura);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
