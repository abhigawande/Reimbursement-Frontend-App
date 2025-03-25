import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IRApiResponse } from '../../model/Employee';
import { ChangeDetectorRef } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-reimbursement',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatSnackBarModule],
  providers: [DatePipe],
  templateUrl: './view-reimbursement.component.html',
  styleUrl: './view-reimbursement.component.css'
})
export class ViewReimbursementComponent implements OnInit {
  @ViewChild('expenseForm') expenseForm!: ElementRef;

  generatePDF() {
    const element = this.expenseForm.nativeElement;

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // Adjust width
      const pageHeight = 297; // A4 page height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Expense_Form.pdf');
    });
  }

  form!: FormGroup;
  reimbursementData: any;
  selectedExpenses: number[] = [];
  totalAmount: number = 0; // Store total amount
  role: string = '';
  status: string = '';
  reList: any[] = [];
  // aproveStatus: number = 0;
  // user_id1 = '';
  // requestId: string = '';
  advance_amount = 0;

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private location: Location, private datePipe: DatePipe, private authService: AuthService, private snackBar: MatSnackBar, private router: Router, private cdr: ChangeDetectorRef) {
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
    // const aproveStatus = this.reimbursementData.aproval_status;
    // console.log(this.reimbursementData.aproval_status);
    this.advance_amount = this.reimbursementData.advance_amount;

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
      // advance_amount: [{ value: this.reimbursementData.advance_amount, disabled: true }],
      // req_date: [{ 
      //   value: this.reimbursementData.req_date 
      //     ? new Date(this.reimbursementData.req_date).toISOString().split('T')[0] // Extract only the date part
      //     : '',
      //   disabled: true 
      // }],
      reimbursement: this.fb.array([])
    });
    const user_id1 = this.form.getRawValue().user_id;
    const requestId = this.form.getRawValue().request_id;
    console.log(user_id1, requestId);

    this.viewReimbursement(user_id1, requestId)

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
      // } else if (this.role === 'Accountant') {
      // billStatusLabel = item.bill_status == 2 ? 'Approved by Accountant' : 'Rejected by Accountant';
      // } else if (this.role === 'Admin') {
      // billStatusLabel = item.bill_status == 2 ? 'Approved by Admin' : 'Rejected by Admin';
      // }
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
          selected: [false],
          // advance_amount: [{ value: this.reimbursementData.advance_amount, disabled: true }],
        })
      );
    });
  }

  refreshData() {
    const user_id1 = this.form.getRawValue().user_id;
    const requestId = this.form.getRawValue().request_id;

    this.authService.viewReimbursement(user_id1, requestId).subscribe({
      next: (res: IRApiResponse) => {
        if (res.success && res.data) {
          this.reimbursementData = res.data;
          this.reList = this.reimbursementData.reimbursement;

          // Re-populate the form with fresh data
          this.form.patchValue({
            user_id: this.reimbursementData.user_id,
            name: `${this.reimbursementData.first_name} ${this.reimbursementData.last_name}`,
            project: this.reimbursementData.project,
            project_id: this.reimbursementData.project_id,
            team_no: this.reimbursementData.team_no,
            req_date: this.datePipe.transform(this.reimbursementData.req_date, 'dd-MM-yyyy'),
            request_id: this.reimbursementData.request_id
          });

          // Reset FormArray and re-add items
          const reimbursementArray = this.form.get('reimbursement') as FormArray;
          reimbursementArray.clear();
          this.reimbursementData.reimbursement.forEach((item: any) => {
            reimbursementArray.push(
              this.fb.group({
                id: [{ value: item.id, disabled: false }],
                description: [{ value: item.description, disabled: false }],
                expense_date: [{ value: this.datePipe.transform(item.expense_date, 'yyyy-MM-dd'), disabled: false }],
                amount: [{ value: item.amount, disabled: false }],
                bill_status: [{ value: item.bill_status, disabled: true }],
                document: [null],
                bill_docs: [item.bill_docs],
                comment: [{ value: item.comment, disabled: false }],
                button_status: [{ value: item.button_status, disabled: false }],
                bill_status1: [{ value: item.bill_status, disabled: false }],
                expense_status: [{ value: item.expense_status, disabled: false }],
              })
            );
          });

          console.log('Data refreshed successfully.');
        } else {
          console.error('Failed to fetch reimbursement data');
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }



  selectedItems: any[] = []; // Track selected checkboxes
  allChecked: boolean = false; // Track if all are checked
  buttonLabel: string = 'Approve'; // Default button text
  // toggleSelectAll(event: any) {
  //   this.allChecked = event.target.checked;

  //   if (this.allChecked) {
  //     // Select all items
  //     this.selectedExpenses = this.items.controls.map((control) => control.value.id);
  //   } else {
  //     // Deselect all items
  //     this.selectedExpenses = [];
  //   }

  //   // Update checkbox UI
  //   this.items.controls.forEach((control, index) => {
  //     control.patchValue({ selected: this.allChecked });
  //   });
  //   console.log('Selected Expenses:', this.selectedExpenses);
  // }

  // toggleSelectAll(event: any) {
  //   this.allChecked = event.target.checked;

  //   if (this.allChecked) {
  //     this.selectedExpenses = this.items.controls
  //       .map(control => control.getRawValue().id)
  //       .filter(id => id !== undefined && id !== null);
  //   } else {
  //     this.selectedExpenses = [];
  //   }

  //   // ✅ Ensure all checkboxes get updated
  //   this.items.controls.forEach((control, index) => {
  //     control.patchValue({ selected: this.allChecked }); // Update checkbox state
  //   });

  //   console.log('All checked:', this.allChecked);
  //   console.log('Selected Expenses:', this.selectedExpenses);
  // }

  toggleSelectAll(event: any) {
    this.allChecked = event.target.checked;

    if (this.allChecked) {
      // ✅ Store selected expense IDs (avoiding undefined/null)
      this.selectedExpenses = this.items.controls
        .map(control => control.get('id')?.value)
        .filter(id => id !== undefined && id !== null);
    } else {
      this.selectedExpenses = [];
    }

    // ✅ Update checkbox state in the UI properly
    this.items.controls.forEach((control, index) => {
      control.patchValue({ selected: this.allChecked }); // Ensure checkbox updates
    });
    this.cdr.detectChanges();
    console.log('All checked:', this.allChecked);
    console.log('Selected Expenses:', this.selectedExpenses);
  }




  onCheckboxChange(event: any, index: number) {
    // const expenseId = this.items.at(index).getRawValue().id;

    if (event.target.checked) {
      this.selectedItems.push(index);
    } else {
      this.selectedItems = this.selectedItems.filter(i => i !== index);
      console.log('Selected:', this.selectedItems);
    }
    this.checkAllChecked();

    const expense = this.items.at(index).getRawValue();
    const expenseId = expense.id;
    const amount = Number(expense.amount); // Ensure it's a number
    if (event.target.checked) {
      if (!this.selectedExpenses.includes(expenseId)) {
        this.selectedExpenses.push(expenseId);
      }
    } else {
      this.selectedExpenses = this.selectedExpenses.filter(id => id !== expenseId);
    }
    // Calculate total amount
    this.calculateTotalAmount();
    console.log('Selected Expenses:', this.selectedExpenses);
  }

  // Function to calculate total amount
  calculateTotalAmount() {
    this.totalAmount = this.selectedExpenses.reduce((sum, id) => {
      const expense = this.items.getRawValue().find((e: any) => e.id === id);
      return sum + (expense ? Number(expense.amount) : 0);
    }, 0);
  }

  // Approve selected expenses
  approveExpenses() {
    const allExpenses = this.items.getRawValue(); // Get all expense data, including disabled fields

    let expenseData = [];

    if (this.role === 'Accountant') {
      this.status = 'F'
      expenseData = allExpenses.map(expense => ({
        id: expense.id,
        bill_status: this.selectedExpenses.includes(expense.id) ? 4 : 5,
        comment: expense.comment ? expense.comment : ''
      }));
    } else if (this.role === 'Finance') {
      this.status = 'S'
      expenseData = allExpenses.map(expense => ({
        id: expense.id,
        bill_status: this.selectedExpenses.includes(expense.id) ? 6 : 7,
        comment: expense.comment ? expense.comment : ''
      }));
    } else {
      this.status = 'A'
      expenseData = allExpenses.map(expense => ({
        id: expense.id,
        bill_status: this.selectedExpenses.includes(expense.id) ? 2 : 3,
        comment: expense.comment ? expense.comment : ''
      }));
    }

    const payload = {
      // role:this.role,
      request_id: this.reimbursementData.request_id,  // Use the request_id from the URL
      status: this.status,
      role: this.role,
      totalAmount: this.totalAmount,
      expense: expenseData
      // expense: allExpenses.map(expense => ({
      //   id: expense.id,
      //   bill_status: this.selectedExpenses.includes(expense.id) ? 2 : 3
      // }))
    };

    console.log('Payload to be sent:', payload);
    this.authService.aproveRequest(payload).subscribe({
      next: (response: any) => {
        console.log('API Success Response:', response);

        if (response.result === 'Success') {
          alert('Expenses approved successfully!');  // Show success message
          // Reset Form & Clear Selections
          this.selectedExpenses = [];
          this.form.reset(); // Reset form fields
          this.ngOnInit(); // Reload data to reset the table
        } else {
          alert('Approval failed. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error approving expenses:', error);
        alert('An error occurred while approving expenses.');
      }
    });
  }
  get items(): FormArray {
    return this.form.get('reimbursement') as FormArray;
  }

  goBack() {
    this.location.back();
  }
  // isImageFile(fileName: string): boolean {
  //   return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  // }

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
      console.log(`File selected for row ${index}:`, file.name);

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
        this.refreshData();
        this.form.reset();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.snackBar.open(`Error: ${err.error.message || 'Something went wrong'}`, 'Close', { duration: 3000 });
      }
    });
  }

  // Function to check if all items are selected
  checkAllChecked() {
    const totalItems = this.reList.length;
    this.allChecked = this.selectedItems.length === totalItems;
    this.buttonLabel = this.allChecked ? 'Settle' : 'Approve';
  }

  approveExpense(index: number) {
    const item = this.items.at(index);
    const expense = item.getRawValue();
    if (this.role == 'Manager') {
      this.processApproval(expense.id, 2, 1, expense.comment); // 2 for manager approved status
    } else if (this.role == 'Accountant') {
      this.processApproval(expense.id, 4, 1, expense.comment); // 4 for manager approved status
    } else if (this.role == 'Finance') {
      this.processApproval(expense.id, 6, 1, expense.comment); // 6 for manager approved status
    }


    item.patchValue({ status: 'approved' });
    item.disable(); // Disable this row after approval
  }

  rejectExpense(index: number) {
    const item = this.items.at(index);
    const expense = item.getRawValue();
    if (this.role == 'Manager') {
      this.processApproval(expense.id, 3, 1, expense.comment); // 2 for manager approved status
    } else if (this.role == 'Accountant') {
      this.processApproval(expense.id, 5, 1, expense.comment); // 4 for manager approved status
    } else if (this.role == 'Finance') {
      this.processApproval(expense.id, 7, 1, expense.comment); // 6 for manager approved status
    }
    // this.processApproval(expense.id, 3, 1, expense.comment); // 3 for rejected status

    item.patchValue({ status: 'rejected' });
    item.disable(); // Disable this row after rejection
  }

  // Function to check if an item is approved or rejected
  isDisabled(index: number): boolean {
    const item = this.items.at(index);
    return item.value.status === 'approved' || item.value.status === 'rejected';
  }

  approveSelected() {
    if (this.role == 'Manager') {
      this.processMultipleApproval(2, 1); // 2 for approved status
    } else if (this.role == 'Accountant') {
      this.processMultipleApproval(4, 1); // 2 for approved status
    } else if (this.role == 'Finance') {
      this.processMultipleApproval(6, 1); // 2 for approved status
    }
  }
  rejectSelected() {
    if (this.role == 'Manager') {
      this.processMultipleApproval(3, 1); // 2 for approved status
    } else if (this.role == 'Accountant') {
      this.processMultipleApproval(5, 1); // 2 for approved status
    } else if (this.role == 'Finance') {
      this.processMultipleApproval(7, 1); // 2 for approved status
    }
  }

  processApproval(expenseId: number, status: number, button_status: number, comment: string) {
    const expense1 = this.items.getRawValue().find(e => e.id === expenseId);
    const amount = expense1 ? Number(expense1.amount) : 0;
    const payload = {
      request_id: this.reimbursementData.request_id,
      role: this.role,
      totalAmount: amount,
      expense: [{ id: expenseId, bill_status: status, button_status: button_status, comment }]
    };

    this.authService.aproveRequest(payload).subscribe({
      next: (response: any) => {
        if (response.result === 'Success') {
          alert(status === 2 || status === 4 || status === 6 ? 'Expense approved successfully!' : 'Expense rejected successfully!');
          this.refreshData();
          this.ngOnInit(); // Reload data
        } else {
          alert('Action failed. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error processing request:', error);
        alert('An error occurred.');
      }
    });
  }
  processMultipleApproval(status: number, button_status: number) {
    const allExpenses = this.items.getRawValue();
    const selectedExpenses = this.selectedExpenses.map(expenseId => ({
      id: expenseId,
      bill_status: status,
      button_status: button_status,
      comment: allExpenses.find(e => e.id === expenseId)?.comment || ''
    }));

    if (selectedExpenses.length === 0) {
      alert('Please select at least one expense.');
      return;
    }

    const payload = {
      request_id: this.reimbursementData.request_id,
      role: this.role,
      totalAmount: this.totalAmount,
      expense: selectedExpenses
    };

    this.authService.aproveRequest(payload).subscribe({
      next: (response: any) => {
        if (response.result === 'Success') {
          alert(status === 2 || status === 4 || status === 6 ? 'Selected expenses approved!' : 'Selected expenses rejected!');
          this.refreshData();
          this.ngOnInit(); // Reload data
        } else {
          alert('Action failed. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error processing request:', error);
        alert('An error occurred.');
      }
    });
  }

  reimbursement: any[] = [];
  viewReimbursement(user_id: any, req_id: any) {
    this.authService.viewReimbursement(user_id, req_id).subscribe((res: IRApiResponse) => {
      // console.log("API Response:", res); // Check what the API is returning exactly
      // console.log("Type of success:", typeof res.success); // Check the type of success
      if (res.success && res.data) {
        // Correctly add the designation field at the top level
        // console.log('hi');

        this.reimbursement = {
          ...res.data,
          designation: "Manager" // Add designation
        };
        // console.log("🛠 Modified Data with Designation:", this.reimbursement);

        // this.router.navigate([`/view-reimbursement/${req_id}`], { state: { data: this.reimbursement } });
      } else {
        console.error("Failed to fetch reimbursement data");
      }
    })
  }

  isButtonDisabled(billStatus: number, buttonStatus: number): boolean {
    // console.log("Bill Status:", billStatus, "Button Status:", buttonStatus);
    const disabledStatuses = [2, 3, 4, 5, 6, 7];
    return disabledStatuses.includes(billStatus) && (buttonStatus === 1);
  }

}
