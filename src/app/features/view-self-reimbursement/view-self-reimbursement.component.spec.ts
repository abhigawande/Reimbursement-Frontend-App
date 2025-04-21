import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSelfReimbursementComponent } from './view-self-reimbursement.component';

describe('ViewSelfReimbursementComponent', () => {
  let component: ViewSelfReimbursementComponent;
  let fixture: ComponentFixture<ViewSelfReimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSelfReimbursementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSelfReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
