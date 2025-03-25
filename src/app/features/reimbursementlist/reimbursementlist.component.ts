import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Reimbursementlist } from '../../model/Employee';
import { Router } from '@angular/router';
import { IRApiResponse } from '../../model/Employee';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reimbursementlist',
  imports: [CommonModule,NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './reimbursementlist.component.html',
  styleUrl: './reimbursementlist.component.css'
})
export class ReimbursementlistComponent implements OnInit {
  // itemsPerPageControl = new FormControl(5); // Default value
  displayedColumns: string[] = ['id', 'name', 'amount', 'date', 'actions']; // Define columns
  role: string = '';
  // currentPage = 1;

  // reList: any[] = []; // Your table data
  // currentPage = 1; 
  // itemsPerPage = 2; // Default items per page

  // reList = []; // Your data list
  currentPage = 1;
  itemsPerPageControl = new FormControl<number>(5); // Ensure it always has a number


  constructor(private authService: AuthService, private router: Router) { 
    this.itemsPerPageControl.valueChanges.subscribe(value => {
      this.itemsPerPage = value ?? 5;
      this.currentPage = 1; // Reset to first page
    });
  }
  // itemsPerPage = this.itemsPerPageControl.value; // Ensure itemsPerPage gets updated
  itemsPerPage = this.itemsPerPageControl.value ?? 5; // Bind to dropdown

  reList: Reimbursementlist[] = [];

  ngOnInit(): void {
    this.getReimbursementList();
    const user = this.authService.getUserInfo();
    this.role = user.role;
  }

  getReimbursementList() {
    this.authService.getReimbrsementList().subscribe((res: any) => {
      this.reList = res.data;
    })
  }
  reimbursement: any[] = [];
  viewReimbursement(user_id: any, req_id: any) {
    this.authService.viewReimbursement(user_id, req_id).subscribe((res: IRApiResponse) => {
      console.log("API Response:", res); // Check what the API is returning exactly
      console.log("Type of success:", typeof res.success); // Check the type of success
      if (res.success && res.data) {
        // Correctly add the designation field at the top level
        // console.log('hi');

        this.reimbursement = {
          ...res.data,
          designation: "Manager" // Add designation
        };
        console.log("🛠 Modified Data with Designation:", this.reimbursement);

        this.router.navigate([`/view-reimbursement/${user_id}/${req_id}`], { state: { data: this.reimbursement } });
      } else {
        console.error("Failed to fetch reimbursement data");
      }
    })
  }
}
