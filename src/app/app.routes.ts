import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/auth-guard.service';
import { LayoutComponent } from './features/layout/layout.component';
import { ReimbursementComponent } from './features/reimbursement/reimbursement.component';
import { ReimbursementlistComponent } from './features/reimbursementlist/reimbursementlist.component';
import { ViewReimbursementComponent } from './features/view-reimbursement/view-reimbursement.component';
import { AdvancepayComponent } from './features/advancepay/advancepay.component';
import { AdvancePayReportComponent } from './features/advance-pay-report/advance-pay-report.component';
import { AuthorityReimburseReportComponent } from './features/authority-reimburse-report/authority-reimburse-report.component';
import { FinalSettlementReportComponent } from './features/final-settlement-report/final-settlement-report.component';
import { ViewSelfReimbursementComponent } from './features/view-self-reimbursement/view-self-reimbursement.component';


export const routes: Routes = [
    // { path: '', component: LoginComponent },
    // { path: 'signup', component: SignupComponent },
    // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

    {
        path: '',
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'reimbursement',
                component: ReimbursementComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'reimbursement-list',
                component: ReimbursementlistComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'view-reimbursement/:user_id/:req_id',
                component: ViewReimbursementComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'advance-pay',
                component: AdvancepayComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'advance-pay-report',
                component: AdvancePayReportComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'self-reimbursement',
                component: AuthorityReimburseReportComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'final-settlement-report',
                component: FinalSettlementReportComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'view-self-reimbursement/:user_id/:req_id',
                component: ViewSelfReimbursementComponent,
                canActivate: [AuthGuard],
            },
        ]
    }
];
