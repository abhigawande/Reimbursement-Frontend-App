import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Employee, IApiResponse, IRApiResponse, IApiResponseSign, User,ApiResponse } from '../model/Employee';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  signup(obj: Employee) {
    return this.http.post<Employee>(`${this.apiUrl}/auth/signup`, obj);
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getDept() {
    return this.http.get<IApiResponse>(`${this.apiUrl}/auth/department`);
  }
  getDesignation() {
    return this.http.get<IApiResponse>(`${this.apiUrl}/auth/designation`);
  }
  getManager() {
    return this.http.get<IApiResponse>(`${this.apiUrl}/auth/manager`);
  }
  getProject() {
    return this.http.get(`${this.apiUrl}/auth/project`);
  }
  getUserDetails() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<User>(`${this.apiUrl}/user`, { headers });
  }
  getReimbrsementList() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/reimbursement-list`, { headers });
  }
  getSelfReimbrsementList() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/authority-reimbursement-list`, { headers });
  }
  submitReimbursement(data: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/reimbursment-request`, data, { headers });
  }
  viewReimbursement(user_id: any, req_id: any): Observable<IRApiResponse> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get<IRApiResponse>(`${this.apiUrl}/reimbursement-request/${user_id}/${req_id}`, { headers });
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  aproveRequest(data: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/aproval`, data, { headers });
  }

  // Check if token is expired
  // isTokenExpired(): boolean {
  //   const token = this.getToken();
  //   if (!token) return true;

  //   const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  //   const expiryTime = tokenPayload.exp * 1000; // Convert to milliseconds

  //   return Date.now() > expiryTime;
  // }

  // Auto logout when token expires
  // checkSession() {
  //   setInterval(() => {
  //     if (this.isTokenExpired()) {
  //       alert("Session expired. Please log in again.");
  //       this.logout();
  //     }
  //   }, 5000); // Check every 5 seconds
  // }

  checkSession(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode JWT token (assuming it contains an "exp" field in seconds)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) this.logout(); // Auto logout if expired
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  getUserInfo(): any {
    const token = this.getToken();
    if (!token) return null;
  
    return jwtDecode(token);
  }

  advancePay(advancepay: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<ApiResponse>(`${this.apiUrl}/advance-pay`, advancepay, { headers });
  }

  advancePaymentReport() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/advance-pay-report`, { headers });
  }

  updateReimbursement(data: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/update-reimbursement-request`, data, { headers });
  }

  finalSettlementReport() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/final-settlement-report`, { headers });
  }
}
