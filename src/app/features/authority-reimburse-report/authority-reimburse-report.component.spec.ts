import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityReimburseReportComponent } from './authority-reimburse-report.component';

describe('AuthorityReimburseReportComponent', () => {
  let component: AuthorityReimburseReportComponent;
  let fixture: ComponentFixture<AuthorityReimburseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityReimburseReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityReimburseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
