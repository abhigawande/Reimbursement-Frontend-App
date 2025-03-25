import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancepayComponent } from './advancepay.component';

describe('AdvancepayComponent', () => {
  let component: AdvancepayComponent;
  let fixture: ComponentFixture<AdvancepayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancepayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
