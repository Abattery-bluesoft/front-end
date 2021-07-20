import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Employee } from 'src/app/models/employee/employee.model';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Data } from 'src/app/models/data.model';
import { Router } from '@angular/router';
import {
  SortColumn,
  SortDirection,
} from 'src/app/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { tap, debounceTime, switchMap, delay } from 'rxjs/operators';
import { sortTable, matches } from '../../functions/function';

interface SearchResult {
  employees: Employee[];
  total: number;
}
interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private api = `${environment.apiUrl}employees`;
  employees: Employee[] = [];
  private _employees$ = new BehaviorSubject<Employee[]>([]);

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 3,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  /**
   * Creates an instance of EmployeeService.
   * @param {HttpClient} http
   * @param {Router} router
   * @memberof EmployeeService
   */
  constructor(private http: HttpClient, private router: Router) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._employees$.next(result.employees);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get employees$() {
    return this._employees$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  /**
   *
   *
   * @memberof EmployeeService
   */
  getAll() {
    this.http.get(`${this.api}`).subscribe(
      (data: any) => {
        const employees = data.map((employee: Employee) => ({
          ...employee,
          status: this.getStatus(employee.availabilityDate, employee.startDate),
        }));
        this._employees$.next(employees);
        this.employees = this._employees$.getValue();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   *
   *
   * @param {string} id
   * @return {*}  {Promise<Employee>}
   * @memberof EmployeeService
   */
  getById(id: string): Promise<Employee> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.api}/${id}`).subscribe(
        (data: any) => {
          resolve(data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  /**
   *
   *
   * @param {string} id
   * @memberof EmployeeService
   */
  delete(id: string) {
    this.http.delete(`${this.api}/${id}`).subscribe(
      (data) => {
        this.getAll();
      },
      (err) => {
        console.log('erreur lors de la suppression');
      }
    );
  }

  /**
   *
   *
   * @param {Employee} employee
   * @param {File} cv
   * @return {*}
   * @memberof EmployeeService
   */
  add(employee: Employee, cv: File) {
    return new Promise((resolve, reject) => {
      let employeeData: FormData = new FormData();
      employeeData.append('employee', JSON.stringify(employee));
      employeeData.append('file', cv);
      this.http.post(`${this.api}`, employeeData).subscribe(
        (data) => {
          this.getAll();
        },
        (err) => console.log(err)
      );
    }).then(() => {});
  }

  /**
   *
   *
   * @param {string} id
   * @param {Employee} employee
   * @param {File} [cv]
   * @return {*}
   * @memberof EmployeeService
   */
  update(id: string, employee: Employee, cv?: File) {
    return new Promise((resolve, reject) => {
      let employeeData: FormData = new FormData();
      employeeData.append('employee', JSON.stringify(employee));
      if (cv) {
        employeeData.append('file', cv);
      }
      this.http.put(`${this.api}/${id}`, employeeData).subscribe(
        (data) => {
          this.getAll();
        },
        (err) => console.log(err)
      );
    });
  }

  /**
   *
   *
   * @param {*} data
   * @memberof EmployeeService
   */
  emitEmployee(data: any) {
    this._employees$.next(data);
  }

  private _search(): Observable<SearchResult> {
    const {
      sortColumn,
      sortDirection,
      pageSize,
      page,
      searchTerm,
    } = this._state;

    // 1. sort
    let employees = sortTable(this.employees, sortColumn, sortDirection);

    // 2. filter
    employees = employees.filter((employee) => matches(employee, searchTerm));
    const total = employees.length;

    // 3. paginate
    employees = employees.slice(
      (page - 1) * pageSize,
      (page - 1) * pageSize + pageSize
    );
    return of({ employees, total });
  }

  /**
   *
   *
   * @private
   * @param {Partial<State>} patch
   * @memberof EmployeeService
   */
  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  /**
   *
   *
   * @param {Date} [dispoDate]
   * @param {Date} [startDate]
   * @return {*}  {string}
   * @memberof EmployeeService
   */
  getStatus(dispoDate?: Date, startDate?: Date): string {
    const today = new Date();
    if (dispoDate && this.getTime(today) < this.getTime(dispoDate)) {
      return 'blue';
    } else if (dispoDate && this.getTime(today) > this.getTime(dispoDate)) {
      return 'red';
    } else {
      return '';
    }
  }

  /**
   *
   *
   * @param {Date} date
   * @return {*}
   * @memberof EmployeeService
   */
  getTime(date: Date) {
    return new Date(date).getTime();
  }
}
