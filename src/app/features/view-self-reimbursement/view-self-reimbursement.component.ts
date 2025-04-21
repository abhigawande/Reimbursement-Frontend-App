import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IRApiResponse } from '../../model/Employee';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-self-reimbursement',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatSnackBarModule, FontAwesomeModule, MatTooltipModule, MatIconModule],
  providers: [DatePipe],
  templateUrl: './view-self-reimbursement.component.html',
  styleUrl: './view-self-reimbursement.component.css'
})
export class ViewSelfReimbursementComponent implements OnInit {
  form!: FormGroup;
  reimbursementData: any;
  totalAmount: number = 0; // Store total amount
  role: string = '';
  status: string = '';
  reList: any[] = [];
  advance_amount = 0;
  req_status = '';
  aproval_status = 0;
  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private location: Location, private datePipe: DatePipe, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    const state = this.location.getState() as { data: any };
    this.reimbursementData = state?.data;
    if (this.reimbursementData) {
      this.reList = this.reimbursementData.reimbursement; // Assign reimbursement data to reList
    }
  }

  ngOnInit(): void {
    if (!this.reimbursementData) {
      alert('No data found!');
      return;
    }
    console.log("Reimbursement Data:", this.reimbursementData);

    const user = this.authService.getUserInfo();
    this.role = user.role;
    console.log(this.role);

    this.req_status = this.reimbursementData.status;
    this.advance_amount = this.reimbursementData.advance_amount;
    this.aproval_status = this.reimbursementData.aproval_status;

    this.status = user.status;

    this.form = this.fb.group({
      user_id: [{ value: this.reimbursementData.user_id, disabled: true }],
      name: [{ value: `${this.reimbursementData.first_name} ${this.reimbursementData.last_name}`, disabled: true }],
      project: [{ value: this.reimbursementData.project, disabled: true }],
      project_id: [{ value: this.reimbursementData.project_id, disabled: true }],
      team_no: [{ value: this.reimbursementData.team_no, disabled: true }],
      req_date: [{ value: this.datePipe.transform(this.reimbursementData.req_date, 'dd-MM-yyyy'), disabled: true }],
      request_id: [{ value: this.reimbursementData.request_id, disabled: true }],
      aproval_status: [{ value: this.reimbursementData.aproval_status, disabled: true }],
      reimbursement: this.fb.array([])
    });
    const user_id1 = this.form.getRawValue().user_id;
    const requestId = this.form.getRawValue().request_id;
    // console.log(user_id1, requestId);

    this.viewReimbursement(user_id1, requestId)
    const reimbursementArray = this.form.get('reimbursement') as FormArray;

    this.reimbursementData.reimbursement.forEach((itemre: any) => {
      let billStatusLabel = '';

      // if (this.role === 'Manager') {
      if (itemre.bill_status == 1) {
        billStatusLabel = 'Pending';  // If bill_status is 1, show "Pending"
      } else if (itemre.bill_status == 2) {
        billStatusLabel = 'Approved by Manager';
      } else if (itemre.bill_status == 3) {
        billStatusLabel = 'Rejected by Manager';
      } else if (itemre.bill_status == 4) {
        billStatusLabel = 'Approved by Accountant';
      } else if (itemre.bill_status == 5) {
        billStatusLabel = 'Rejected by Accountant';
      } else if (itemre.bill_status == 6) {
        billStatusLabel = 'Approved by Finance';
      } else if (itemre.bill_status == 7) {
        billStatusLabel = 'Rejected by Finance';
      }
      const isDisabled = itemre.bill_status == 2 || itemre.bill_status == 4 || itemre.bill_status == 6;

      this.items.push(
        this.fb.group({
          id: [{ value: itemre.id, disabled: isDisabled }],
          description: [{ value: itemre.description, disabled: isDisabled }],
          expense_date: [{ value: this.datePipe.transform(itemre.expense_date, 'yyyy-MM-dd'), disabled: isDisabled }],
          amount: [{ value: itemre.amount, disabled: isDisabled }],
          bill_status: [{ value: billStatusLabel, disabled: true }],
          document: [null],
          bill_docs: [itemre.bill_docs],
          comment: [{ value: itemre.comment, disabled: false }],
          button_status: [{ value: itemre.button_status, disabled: false }],
          bill_status1: [{ value: itemre.bill_status, disabled: false }],
          expense_status: [{ value: itemre.expense_status, disabled: false }],
        })
      );
    });
  }

  get items(): FormArray {
    return this.form.get('reimbursement') as FormArray;
  }

  goBack() {
    this.location.back();
  }

  isImageFile(fileName: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  }

  getImageUrl(filePath: string): string {
    if (!filePath) return '';
    return `http://localhost:3000/${filePath}`;  // Adjust this URL based on your backend
  }

  onFileSelect(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // console.log(`File selected for row ${index}:`, file.name);

      // Update form data and remove old file reference
      this.items.at(index).patchValue({ document: file, bill_docs: '' });
    }
  }

  updateForm(): void {
    if (this.form.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', this.form.getRawValue().user_id);
    formData.append('project_id', this.form.getRawValue().project_id);
    formData.append('team_no', this.form.getRawValue().team_no);
    formData.append('req_date', this.form.getRawValue().req_date);
    formData.append('request_id', this.form.getRawValue().request_id);
    // formData.append('req_date', this.form.value.req_date);

    // Preserve existing reimbursement data
    let reimbursementArray: any[] = [...this.reimbursementData.reimbursement];

    this.items.controls.forEach((control, index) => {
      const item = control.value;
      // Find existing reimbursement entry (if any)
      const existingIndex = reimbursementArray.findIndex(e => e.id === item.id);

      if (existingIndex !== -1) {
        // Update only modified properties
        reimbursementArray[existingIndex] = {
          ...reimbursementArray[existingIndex], // Keep old data
          description: item.description,
          expense_date: item.expense_date,
          amount: item.amount,
          bill_status: 1, // Assuming bill_status should always be updated
          bill_docs: item.bill_docs,
          button_status: 0
        };

        if (item.document) {
          // Append new file & update reference
          formData.append(`bill_docs_${index}`, item.document);
          reimbursementArray[existingIndex].bill_docs = `bill_docs_${index}`;
        } else {
          // Keep existing document if no new file is selected
          reimbursementArray[existingIndex].bill_docs = item.bill_docs;
        }

        // reimbursementArray.push(reimbursementData);'
      }
    });

    formData.append('reimbursement', JSON.stringify(reimbursementArray));

    this.authService.updateReimbursement(formData).subscribe({
      next: (res) => {
        this.snackBar.open('Updated successfully!', 'Close', { duration: 3000 });
        // this.refreshData();
        this.form.reset();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.snackBar.open(`Error: ${err.error.message || 'Something went wrong'}`, 'Close', { duration: 3000 });
      }
    });
  }

  reimbursement: any[] = [];
  viewReimbursement(user_id: any, req_id: any) {
    this.authService.viewSelfReimbursement(user_id, req_id).subscribe((res: IRApiResponse) => {
      if (res.success && res.data) {
        this.reimbursement = {
          ...res.data,
          designation: "Manager" // Add designation
        };
      } else {
        console.error("Failed to fetch reimbursement data");
      }
    })
  }

}
