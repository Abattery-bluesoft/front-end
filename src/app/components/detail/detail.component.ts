import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../models/employee/employee.model';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TransferState } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [DatePipe]
})
export class DetailComponent implements OnInit {

  constructor(private state: TransferState, private employeeService:EmployeeService ,private datePipe: DatePipe, private route: ActivatedRoute) { }
  @Input() public employee: Employee | undefined;

  ngOnInit(): void {
  }

}
