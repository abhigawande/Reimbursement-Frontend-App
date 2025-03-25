import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../app/core/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Reimbursement-Frontend-App';
  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.checkSession()) {
      this.authService.logout(); // Auto logout if session is expired
    }
  }
}
