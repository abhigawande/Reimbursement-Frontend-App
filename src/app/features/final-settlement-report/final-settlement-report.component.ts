import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FinalSettlementReport } from '../../model/Employee';
import { CommonModule } from '@angular/common';
import * as ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-final-settlement-report',
  imports: [CommonModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './final-settlement-report.component.html',
  styleUrl: './final-settlement-report.component.css'
})
export class FinalSettlementReportComponent implements OnInit {
  currentPage = 1;
  itemsPerPageControl = new FormControl<number>(5);
  itemsPerPage = this.itemsPerPageControl.value ?? 5;
  constructor(private authService: AuthService) {
    this.itemsPerPageControl.valueChanges.subscribe(value => {
      this.itemsPerPage = value ?? 5;
      this.currentPage = 1;
    });
  }
  reList: FinalSettlementReport[] = [];
  ngOnInit(): void {
    this.getFinalSettlementReport()
  }

  getFinalSettlementReport() {
    this.authService.finalSettlementReport().subscribe((res: any) => {
      this.reList = res.data;
    })
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Final Settlement Report');

    // **🔹 Add Headers**
    worksheet.addRow(['Employee Name', 'Date', 'Paid By Advance', 'To Be Paid', 'Claim Amount']);

    // **🔹 Add Data Rows**
    this.reList.forEach((item) => {
      worksheet.addRow([`${item.first_name} ${item.last_name}`, item.date, item.paid_by_advance, item.to_be_paid, item.claim_amount]);
    });

    // **🔹 Format the Header Row**
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }; // Make headers bold
      cell.alignment = { horizontal: 'center' }; // Center align headers
    });

    // **🔹 Auto-fit Columns**
    worksheet.columns.forEach((column) => {
      column.width = 20; // Set uniform column width
    });

    // **🔹 Generate & Download Excel File**
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Final_Settlement_Report.xlsx');
    });
  }
}
