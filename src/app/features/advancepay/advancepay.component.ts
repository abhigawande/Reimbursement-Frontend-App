import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { IApiResponse, EmpManager, Employee, ApiResponse } from '../../model/Employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advancepay',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './advancepay.component.html',
  styleUrls: ['./advancepay.component.css']
})
export class AdvancepayComponent implements OnInit {
  advancepay = {
    emp_id: '',
    amount: null,  // Ensure it's a number, not a string
    date: '',
  };

  managerList: EmpManager[] = [];
  employeeObj: Employee = new Employee();

  constructor(private authService: AuthService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.getManagerList();
  }

  getManagerList() {
    this.authService.getManager().subscribe((res: IApiResponse) => {
      this.managerList = res.data;
    });
  }

  onPay(form: any) {
    this.authService.advancePay(this.advancepay).subscribe((res: ApiResponse) => {
      if (res.result) {
        this.router.navigate(['/advance-pay-report']);
        this.snackBar.open(res.message, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        // Reset Form Data
        // this.advancepay = {
        //   emp_id: '',
        //   amount: null,
        //   date: '',
        // };
        form.resetForm();

        // Refresh Manager List
        this.getManagerList();
      } else {
        this.snackBar.open('Add Payment Failed.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
