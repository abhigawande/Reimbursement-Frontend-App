import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, MatSnackBarModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };



  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  // login() {
  //   this.authService.login(this.credentials).subscribe((res: any) => {
  //     localStorage.setItem('authToken', res.token);
  //     this.router.navigate(['/dashboard']);
  //   });
  // }

  login() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('authToken', res.token);
        this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigateByUrl('dashboard');

      },
      error: () => {
        this.snackBar.open('Login failed! Please check your credentials.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
