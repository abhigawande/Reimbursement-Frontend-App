import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementlistComponent } from './reimbursementlist.component';

describe('ReimbursementlistComponent', () => {
  let component: ReimbursementlistComponent;
  let fixture: ComponentFixture<ReimbursementlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
