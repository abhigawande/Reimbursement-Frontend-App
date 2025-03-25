import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancePayReportComponent } from './advance-pay-report.component';

describe('AdvancePayReportComponent', () => {
  let component: AdvancePayReportComponent;
  let fixture: ComponentFixture<AdvancePayReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancePayReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancePayReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
