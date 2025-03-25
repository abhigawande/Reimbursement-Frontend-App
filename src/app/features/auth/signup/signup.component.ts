import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IApiResponse, IApiResponseSign, EmpDept, EmpDesignation, EmpManager,EmpProject, Employee } from '../../../model/Employee';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, MatSnackBarModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  deptList: EmpDept[] = [];
  designationList: EmpDesignation[] = [];
  managerList: EmpManager[] = [];
  // projectList: EmpProject[] = [];

  employeeObj: Employee = new Employee();

  service = inject(AuthService);

  ngOnInit(): void {
    this.getDepartmentList();
    this.getDesignationList();
    this.getManagerList();
    // this.getProjectList();
  }

  getDepartmentList() {
    this.authService.getDept().subscribe((res: IApiResponse) => {
      this.deptList = res.data;
    })
  }
  getDesignationList() {
    this.authService.getDesignation().subscribe((res: IApiResponse) => {
      this.designationList = res.data;
    })
  }
  getManagerList() {
    this.authService.getManager().subscribe((res: IApiResponse) => {
      this.managerList = res.data;
    })
  }
  // getProjectList() {
  //   this.authService.getProject().subscribe((res: IApiResponse) => {
  //     this.projectList = res.data;
  //   })
  // }
  onSignUp() {
    this.authService.signup(this.employeeObj).subscribe((res: Employee) => {
      this.snackBar.open('Employee register successful!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      this.snackBar.open('Registration failed! Please check your credentials.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    })
  }
}
