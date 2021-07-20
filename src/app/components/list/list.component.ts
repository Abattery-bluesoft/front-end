import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../models/employee/employee.model';
import { Subscription, Subject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailComponent } from '../detail/detail.component';
import { AddProfileComponent } from '../add-profile/add-profile.component';
import {
  SortEvent,
  SortableDirective,
} from 'src/app/directives/sortable.directive';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChildren(SortableDirective) headers?: QueryList<SortableDirective>;
  constructor(
    public employeeService: EmployeeService,
    private modalService: NgbModal
  ) {
    this.employees$ = employeeService.employees$;
    this.total$ = employeeService.total$;
  }
  employees$: Observable<Employee[]>;
  employeeSubscription: Subscription | undefined;
  total$: Observable<number>;
  isCollapsed: boolean = true;

  private _search$ = new Subject<void>();
  searchTerm: string = '';
  ngOnInit(): void {
    this.employeeService.getAll();
    this.employeeSubscription = this.employeeService.employees$.subscribe(
      (employees: Employee[]) => {
        return employees;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    this.employeeSubscription?.unsubscribe();
  }

  /**
   *
   *
   * @param {string} id
   * @memberof ListComponent
   */
  delete(id: string) {
    this.employeeService.delete(id);
  }

  /**
   *
   *
   * @param {Employee} employee
   * @memberof ListComponent
   */
  openModal(employee: Employee) {
    const modalRef = this.modalService.open(DetailComponent);
    modalRef.componentInstance.employee = employee;
  }

  /**
   *
   *
   * @param {Employee} employee
   * @memberof ListComponent
   */
  edit(employee: Employee) {
    const modalRef = this.modalService.open(AddProfileComponent);
    modalRef.componentInstance.employee = employee;
    modalRef.componentInstance.isAddMode = false;
  }

  /**
   *
   *
   * @memberof ListComponent
   */
  add() {
    const modalRef = this.modalService.open(AddProfileComponent);
    modalRef.componentInstance.isAddMode = true;
  }

  /**
   *
   *
   * @param {SortEvent} {column, direction}
   * @memberof ListComponent
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    if (this.headers) {
      this.headers.forEach((header) => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
      this.employeeService.sortColumn = column;
      this.employeeService.sortDirection = direction;
    }
  }

  /**
   *
   *
   * @param {*} index
   * @param {Employee} employee
   * @return {*}
   * @memberof ListComponent
   */
  trackId(index: any, employee: Employee) {
    return employee ? employee._id : '';
  }
}
