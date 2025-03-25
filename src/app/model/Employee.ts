export class Employee {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    department_id: number;
    designation_id: number;
    manager_id: number;
    id: number;
    // project_id: number;

    constructor() {
        this.first_name = '';
        this.last_name = '';
        this.email = '';
        this.password = '';
        this.passwordConfirmation = '';
        this.department_id = 0;
        this.designation_id = 0;
        this.manager_id = 0;
        this.id = 0;
        // this.project_id = 0;
    }
}

export interface EmpDept {
    id: number;
    department: string;
}
export interface EmpDesignation {
    id: number;
    designation: string;
}
export interface EmpManager {
    id: number;
    first_name: string;
    last_name: string;
}
export interface EmpProject {
    id: number;
    project: string;
}

export interface IApiResponse {
    data: any;
    success: boolean;
}
export interface IRApiResponse {
    success: boolean;
    data: any;
}
export interface IApiResponseSign {
    result: any
}

export interface Reimbursementlist {
    request_id: number;
    user_id: number;
    req_date: string;
    team_no: number;
    first_name: string;
    last_name: string;
    project: string;
    status: string;
    aprove_status: string;
    approve_status: string;
}

export interface User {
    userId: number;
    project_id: number;
    team_no: number;
    first_name: string;
    last_name: string;
    project: string;
}

export interface ApiResponse {
    message: string;
    result: boolean;
}

export interface AdvancePayReport {
    first_name:string;
    last_name:string;
    amount:number;
    date:string;
}

export interface FinalSettlementReport {
    first_name:string;
    last_name:string;
    paid_by_advance:number;
    to_be_paid:number;
    claim_amount :number;
    date:string;
}