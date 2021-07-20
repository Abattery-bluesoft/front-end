import { SortColumn } from '../directives/sortable.directive';
import { Employee } from '../models/employee/employee.model';
import { PipeTransform } from '@angular/core';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export function sortTable (data: any[], column: SortColumn, direction: string): any[] {
  if (direction === '' || column === '') {
    return data;
  } else {
    return [...data].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}
export function matches(employee: Employee, term: string) {
  return employee.firstName?.toLowerCase().includes(term.toLowerCase())
    || employee.lastName?.toLowerCase().includes(term.toLowerCase())
    || employee.field?.toLowerCase().includes(term.toLowerCase())
    || employee.fonction?.toLowerCase().includes(term.toLowerCase())
    || employee.pole?.toLowerCase().includes(term.toLowerCase())

}
