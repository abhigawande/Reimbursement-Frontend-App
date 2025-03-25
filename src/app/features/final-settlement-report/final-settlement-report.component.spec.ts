import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSettlementReportComponent } from './final-settlement-report.component';

describe('FinalSettlementReportComponent', () => {
  let component: FinalSettlementReportComponent;
  let fixture: ComponentFixture<FinalSettlementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalSettlementReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalSettlementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
