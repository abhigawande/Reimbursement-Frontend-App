import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  role: string = '';
  first_name: string = '';
  last_name: string = '';
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    const user = this.authService.getUserInfo();
    this.role = user.role;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    // console.log(user);
  }

  toggleDropdown(event: any) {
    event.preventDefault();
    let dropdown = new bootstrap.Dropdown(event.target);
    dropdown.toggle();
  }

  logout() {
    this.authService.logout();
  }

  showSidebar = true;
  isMobile = window.innerWidth <= 768;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }
  }

}
