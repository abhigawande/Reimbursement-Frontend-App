import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  role: string = '';
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    this.role = user.role;
  }
  logout() {
    this.authService.logout();
  }
}
