import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoveCardComponent } from './love-card.component';

describe('LoveCardComponent', () => {
  let component: LoveCardComponent;
  let fixture: ComponentFixture<LoveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoveCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
