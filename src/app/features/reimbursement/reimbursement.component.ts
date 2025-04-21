import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IApiResponse, IApiResponseSign, EmpDept, EmpDesignation, EmpManager, EmpProject, Employee } from '../../model/Employee';

@Component({
  selector: 'app-reimbursement',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './reimbursement.component.html',
  standalone: true,
  styleUrls: ['./reimbursement.component.css']
})
export class ReimbursementComponent implements OnInit {
  form!: FormGroup;
  isLoading = true;

  teamNo: number = 0;  // Default value
  inputFields: number[] = [];
  inputValues: string[] = [];

  project: any;
  getProjectList() {
    this.authService.getProject().subscribe((res: any) => {
      this.project = res.data;
    })
  }

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    // this.updateInputs(); // Initialize the inputs
  }
  today: string = new Date().toISOString().split('T')[0];
  ngOnInit(): void {
    this.getProjectList();
    this.authService.getUserDetails().subscribe({
      next: (response: any) => {
        if (response.data && response.data.length > 0) {
          const user = response.data[0]; // Extract first user object

          this.form = this.fb.group({
            name: [{ value: `${user.first_name} ${user.last_name}`, disabled: true }],
            user_id: [{ value: user.userId, disabled: true }, Validators.required],
            // project_id: [{ value: user.project_id }, Validators.required],
            project_id: ['', Validators.required],
            team_no: ['', Validators.required],
            req_date: [new Date().toISOString().split('T')[0], Validators.required],
            total_amount: [{ value: 0, disabled: true }],
            reimbursement: this.fb.array([]), // Initialize reimbursement array
            teammember: this.fb.array([])
          });
          this.updateInputs();
          this.addRow(); // Add an initial row
          this.updateTotalAmount();

          // console.log('Form Initialized:', this.form);
        } else {
          alert('User data not found');
        }
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        alert('Failed to fetch user details.');
      }
    });
  }

  // updateInputs() {
  //   this.inputFields = Array.from({ length: this.teamNo }, (_, i) => i);
  //   this.inputValues = new Array(this.teamNo).fill(''); // Reset input values
  // }

  // updateInputs() {
  //   const teamArray = this.form.get('teammember') as FormArray;
  //   console.log('Before clear',teamArray);

  //   // teamArray.clear(); // clear old values
  //   console.log('After clear',teamArray);

  //   for (let i = 0; i < this.teamNo; i++) {
  //     teamArray.push(this.fb.control('', Validators.required));
  //   }
  //   console.log('End clear',teamArray);

  //   this.inputFields = Array.from({ length: this.teamNo }, (_, i) => i);
  // }

  updateInputs() {
    const teamArray = this.form.get('teammember') as FormArray;

    const currentCount = teamArray.length;

    // If team count is increased
    if (this.teamNo > currentCount) {
      for (let i = currentCount; i < this.teamNo; i++) {
        teamArray.push(this.fb.control('', Validators.required));
      }
    }

    // If team count is decreased
    else if (this.teamNo < currentCount) {
      for (let i = currentCount - 1; i >= this.teamNo; i--) {
        teamArray.removeAt(i);
      }
    }

    this.inputFields = Array.from({ length: this.teamNo }, (_, i) => i);
  }



  // Getter for dynamic array
  get items(): FormArray {
    return this.form.get('reimbursement') as FormArray;
  }
  // Getter for dynamic array
  get teamitems(): FormArray {
    return this.form.get('teammember') as FormArray;
  }

  addRow(): void {
    const reimbursementArray = this.form.get('reimbursement') as FormArray;
    reimbursementArray.push(
      this.fb.group({
        description: ['', Validators.required],
        expense_date: ['', Validators.required],
        amount: [null, [Validators.required, Validators.min(1)]],
        bill_status: ['Pending'],
        document: [null]
      })
    );

    reimbursementArray.get('amount')?.valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });

    // reimbursementArray.push(reimbursementArray);
    this.updateTotalAmount();

    // console.log('Reimbursement Array:', reimbursementArray.value);
  }

  updateTotalAmount(): void {
    const total = this.items.controls.reduce((sum, control) => {
      const amount = control.get('amount')?.value || 0;
      return sum + amount;
    }, 0);
    this.form.patchValue({ total_amount: total });
  }

  onFileSelect(event: any, index: number) {
    const file = event.target.files[0]; // Only allow single file per row
    if (file) {
      this.items.at(index).patchValue({ document: file });
      console.log(`File selected for row ${index}:`, file.name);
    }
  }



  removeRow(index: number): void {
    if (index != 0) {
      this.items.removeAt(index);
      this.updateTotalAmount();
    }
  }

  submitForm(): void {
    if (this.form.invalid) {
      alert('Please fill all required fields.');
      return;
    }
    // console.log('All data:', this.form.getRawValue());

    const teamMembers = this.form.getRawValue().teammember;
    // console.log('Team Members:', teamMembers);



    const formData = new FormData();

    // Append text fields
    formData.append('user_id', this.form.getRawValue().user_id);
    formData.append('project_id', this.form.getRawValue().project_id);
    formData.append('team_no', this.form.getRawValue().team_no);
    formData.append('req_date', this.form.value.req_date);

    const reimbursementArray: any[] = [];

    // Append reimbursement data & files
    this.items.controls.forEach((control, index) => {
      const item = control.value;
      // formData.append(`reimbursement[${index}][description]`, item.description);
      // formData.append(`reimbursement[${index}][expense_date]`, item.expense_date);
      // formData.append(`reimbursement[${index}][amount]`, item.amount);
      // formData.append(`reimbursement[${index}][bill_status]`, 'Pending');

      const reimbursementData: any = {
        description: item.description,
        expense_date: item.expense_date,
        amount: item.amount,
        // bill_status: 'Pending',
        bill_status: 1,
        // bill_docs: item.document
      };

      // Append file if selected
      if (item.document) {
        // formData.append(`bill_docs`, item.document);  // Match 'bill_docs' with backend
        // formData.append(`reimbursement[${index}][bill_docs]`, item.document);

        formData.append(`bill_docs_${index}`, item.document); // Attach file
        reimbursementData.bill_docs = `bill_docs_${index}`; // Store reference in JSON
      }
      reimbursementArray.push(reimbursementData);
    });

    // const teammembersArray: any[] = [];
    const teamMembersArray = this.teamitems.controls.map(control => {
      return { name: control.value };
    });
    formData.append('teamMembers', JSON.stringify(teamMembersArray));


    formData.append('reimbursement', JSON.stringify(reimbursementArray));
    //12
    // formData.append('teamMembers', JSON.stringify(teamMembers));

    console.log('Submitting Form Data:', this.form.getRawValue());

    this.authService.submitReimbursement(formData).subscribe({
      next: (res: any) => {
        // alert('Reimbursement request submitted successfully!');
        this.snackBar.open('Reimbursement request submitted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.form.reset(); // Reset form fields
        this.ngOnInit(); // Reload data to reset the table
        // console.log(res);
      },
      error: (err) => {
        console.error('API Error:', err);
        // alert(`Error: ${err.error.message || 'Something went wrong'}`);
        this.snackBar.open(`Error: ${err.error.message || 'Something went wrong'}`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // updateInputs() {
  //   if (this.teamNo < 2) {
  //     this.inputFields = []; // No input fields for Team No < 2
  //     this.inputValues = [];
  //     return;
  //   }

  //   this.inputFields = Array.from({ length: this.teamNo - 1 }, (_, i) => i);
  //   this.inputValues = new Array(this.teamNo - 1).fill('');
  // }

}
