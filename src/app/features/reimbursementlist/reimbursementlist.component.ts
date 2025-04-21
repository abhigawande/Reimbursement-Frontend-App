import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Reimbursementlist } from '../../model/Employee';
import { Router } from '@angular/router';
import { IRApiResponse } from '../../model/Employee';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reimbursementlist',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, ReactiveFormsModule, FormsModule], //  Ensure FormsModule is imported
  templateUrl: './reimbursementlist.component.html',
  styleUrls: ['./reimbursementlist.component.css']
})
export class ReimbursementlistComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'amount', 'date', 'actions'];
  role: string = '';

  currentPage = 1;
  itemsPerPageControl = new FormControl<number>(5);
  itemsPerPage = this.itemsPerPageControl.value ?? 5;

  reList: Reimbursementlist[] = [];
  filteredList: any[] = []; // Filtered data
  // filteredReimbursements: Reimbursementlist[] = []; //  Corrected filtered array
  // selectedFilter: string = '1'; // Default: Pending
  selectedFilter: string = 'pending'; // Default filter
  selectedFilterM: string = 'pending'; // Default filter
  selectedFilterA: string = 'pending'; // Default filter
  selectedFilterF: string = 'pending'; // Default filter

  constructor(private authService: AuthService, private router: Router) {
    this.itemsPerPageControl.valueChanges.subscribe(value => {
      this.itemsPerPage = value ?? 5;
      this.currentPage = 1;
    });
  }

  ngOnInit(): void {
    this.getReimbursementList();
    const user = this.authService.getUserInfo();
    this.role = user.role;
    // this.selectedFilter = '1';
  }

  getReimbursementList() {
    this.authService.getReimbrsementList().subscribe((res: any) => {
      this.reList = res.data;
      this.applyFilter(); // Apply filter after fetching data
      // this.filteredList = [...this.reList];  // Ensure filteredList has data initially
    });
  }

  // applyFilter() {
  //   console.log("Selected Filter:", this.selectedFilter); // Log current filter
  //   console.log("Before Filtering:", this.reList); // Log list before filtering
  //   if (!this.reList) return;

  //   this.filteredReimbursements =
  //     this.selectedFilter === '8' // "All"
  //       ? this.reList
  //       : this.reList.filter(req => req.aprove_status?.toString() === this.selectedFilter);
  //   console.log("Filtered List:", this.filteredReimbursements);
  // }

  // applyFilter() {
  //   if (this.selectedFilter === '1') {
  //     console.log('in pending');

  //     this.filteredList = this.reList; // Show all records
  //   } else {
  //     console.log('in pending');
  //     const filterMap: { [key: string]: string } = {
  //       '1': 'Pending',
  //       '2': 'Approved',
  //       '3': 'Rejected'
  //     };
  //     console.log(this.selectedFilter);
  //     this.filteredList = this.reList.filter(item => item.aprove_status === filterMap[this.selectedFilter]);
  //     console.log(this.filteredList);

  //   }
  // }

  // applyFilter() {
  //   if (!this.reList || this.reList.length === 0) {
  //     this.filteredList = [];
  //     return;
  //   }

  //   // Map numeric status to filter options
  //   const filterMap: { [key: string]: number } = {
  //     '1': 1,  // Pending
  //     '2': 2,  // Approved
  //     '3': 3   // Rejected
  //   };

  //   console.log("Selected Filter:", this.selectedFilter);
  //   console.log("Full List:", this.reList);

  //   if (this.selectedFilter === '1') {
  //     this.filteredList = this.reList.filter(item => {
  //       // console.log("Checking item:", item); // Debugging
  //       let status = Number(item.aproval_status); // Convert API status to number
  //       let expectedStatus = filterMap[this.selectedFilter]; // Get expected numeric value

  //       // console.log("Status:", status, "| Expected:", expectedStatus); // Debugging

  //       return status === expectedStatus;
  //     });

  //   } else if (this.selectedFilter === '8') {
  //     this.filteredList = [...this.reList];
  //   } else {
  //     this.filteredList = this.reList.filter(item => {
  //       console.log("Checking item:", item); // Debugging
  //       let status = Number(item.aproval_status); // Convert API status to number
  //       let expectedStatus = filterMap[this.selectedFilter]; // Get expected numeric value

  //       console.log("Status:", status, "| Expected:", expectedStatus); // Debugging

  //       return status === expectedStatus;
  //     });
  //   }

  //   console.log("Filtered List:", this.filteredList);
  // }

  // applyFilter() {
  //   if (!this.reList || this.reList.length === 0) {
  //     this.filteredList = [];
  //     return;
  //   }

  //   const filterMap: { [key: string]: number } = {
  //     '1': 1,
  //     '2': 2,
  //     '3': 3
  //   };

  //   if (this.selectedFilter === '8') {
  //     this.filteredList = [...this.reList]; // Show all records
  //   } else {
  //     console.log(this.selectedFilter);

  //     this.filteredList = this.reList.filter(item => item.aproval_status === filterMap[this.selectedFilter]);
  //   }

  //   console.log("Filtered List:", this.filteredList);
  // }

  applyFilter() {
    if (!this.reList || this.reList.length === 0) {
      this.filteredList = [];
      return;
    }

    const filterMap: { [key: string]: number[] } = {
      'pending': [1, 2, 4],
      'approved': [6],
      'review': [3, 5, 7],
      'rejected': [8, 9, 10]
    };

    if (this.selectedFilter === 'all') {
      this.filteredList = [...this.reList]; // Show all records
    } else {
      this.filteredList = this.reList.filter(item =>
        filterMap[this.selectedFilter]?.includes(item.aproval_status)
      );
    }

    console.log("Filtered List:", this.filteredList);
  }

  applyFilterM() {
    if (!this.reList || this.reList.length === 0) {
      this.filteredList = [];
      return;
    }

    const filterMap: { [key: string]: number[] } = {
      'pending': [1],
      'approved': [2, 4, 6],
      // 'review': [3, 5, 7],
      // 'rejected': [8, 9, 10]
    };

    if (this.selectedFilterM === 'all') {
      this.filteredList = [...this.reList]; // Show all records
    } else {
      this.filteredList = this.reList.filter(item =>
        filterMap[this.selectedFilterM]?.includes(item.aproval_status)
      );
    }

    console.log("Filtered List:", this.filteredList);
  }

  applyFilterA() {
    if (!this.reList || this.reList.length === 0) {
      this.filteredList = [];
      return;
    }

    const filterMap: { [key: string]: number[] } = {
      'pending': [2],
      'approved': [4, 6],
      // 'review': [3, 5, 7],
      // 'rejected': [8, 9, 10]
    };

    if (this.selectedFilterA === 'all') {
      this.filteredList = [...this.reList]; // Show all records
    } else {
      this.filteredList = this.reList.filter(item =>
        filterMap[this.selectedFilterA]?.includes(item.aproval_status)
      );
    }

    console.log("Filtered List:", this.filteredList);
  }

  applyFilterF() {
    if (!this.reList || this.reList.length === 0) {
      this.filteredList = [];
      return;
    }

    const filterMap: { [key: string]: number[] } = {
      'pending': [4],
      'approved': [6],
      // 'review': [3, 5, 7],
      // 'rejected': [8, 9, 10]
    };

    if (this.selectedFilterF === 'all') {
      this.filteredList = [...this.reList]; // Show all records
    } else {
      this.filteredList = this.reList.filter(item =>
        filterMap[this.selectedFilterF]?.includes(item.aproval_status)
      );
    }

    console.log("Filtered List:", this.filteredList);
  }




  // filterReimbursements(event: Event) {
  //   const target = event.target as HTMLSelectElement;
  //   this.selectedFilter = target.value;
  //   this.applyFilter();
  // }

  viewReimbursement(user_id: any, req_id: any) {
    this.authService.viewReimbursement(user_id, req_id).subscribe((res: IRApiResponse) => {
      if (res.success && res.data) {
        this.router.navigate([`/view-reimbursement/${user_id}/${req_id}`], { state: { data: res.data } });
      } else {
        console.error("Failed to fetch reimbursement data");
      }
    });
  }
}
