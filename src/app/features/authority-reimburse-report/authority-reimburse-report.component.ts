import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Reimbursementlist } from '../../model/Employee';
import { IRApiResponse } from '../../model/Employee';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-authority-reimburse-report',
  imports: [CommonModule, NgxPaginationModule,ReactiveFormsModule],
  templateUrl: './authority-reimburse-report.component.html',
  styleUrl: './authority-reimburse-report.component.css'
})
export class AuthorityReimburseReportComponent implements OnInit {
  role: string = '';
  
  currentPage = 1;
  itemsPerPageControl = new FormControl<number>(5);
  itemsPerPage = this.itemsPerPageControl.value ?? 5;

  constructor(private authService: AuthService, private router: Router) {
    this.itemsPerPageControl.valueChanges.subscribe(value => {
      this.itemsPerPage = value ?? 5;
      this.currentPage = 1;
    });
  }

  reList: Reimbursementlist[] = [];
  ngOnInit(): void {
    this.getReimbursementList();
    const user = this.authService.getUserInfo();
    this.role = user.role;
  }
  getReimbursementList() {
    this.authService.getSelfReimbrsementList().subscribe((res: any) => {
      this.reList = res.data;
    })
  }
  reimbursement: any[] = [];
  viewReimbursement(user_id: any, req_id: any) {
    this.authService.viewSelfReimbursement(user_id, req_id).subscribe((res: IRApiResponse) => {
      // console.log("API Response:", res); // Check what the API is returning exactly
      // console.log("Type of success:", typeof res.success); // Check the type of success
      if (res.success && res.data) {
        this.reimbursement = {
          ...res.data,
          designation: "Manager" // Add designation
        };
        // console.log("🛠 Modified Data with Designation:", this.reimbursement);

        this.router.navigate([`/view-self-reimbursement/${user_id}/${req_id}`], { state: { data: this.reimbursement } });
      } else {
        console.error("Failed to fetch reimbursement data");
      }
    })
  }
}
