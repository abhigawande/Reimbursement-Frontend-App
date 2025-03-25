import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { AdvancePayReport } from '../../model/Employee';
import { CommonModule } from '@angular/common';
import * as ExcelJS from 'exceljs';
import FileSaver from 'file-saver';


@Component({
  selector: 'app-advance-pay-report',
  imports: [CommonModule],
  templateUrl: './advance-pay-report.component.html',
  styleUrl: './advance-pay-report.component.css'
})
export class AdvancePayReportComponent implements OnInit {
  constructor(private authService: AuthService) { }
  reList: AdvancePayReport[] = [];
  ngOnInit(): void {
    this.getAdvancePaymentReport();
  }

  getAdvancePaymentReport() {
    this.authService.advancePaymentReport().subscribe((res: any) => {
      this.reList = res.data;
    })
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('RepAdvance Pay Reportort');

    // **🔹 Add Headers**
    worksheet.addRow(['Employee Name', 'Email', 'Amount']);

    // **🔹 Add Data Rows**
    this.reList.forEach((item) => {
      worksheet.addRow([`${item.first_name} ${item.last_name}`, item.date, item.amount]);
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
      FileSaver.saveAs(blob, 'Advance_Pay_Report.xlsx');
    });
  }
}
