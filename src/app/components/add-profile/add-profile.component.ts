import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import {  ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Employee } from 'src/app/models/employee/employee.model';
import { from } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.component.html',
  styleUrls: ['./add-profile.component.scss']
})
export class AddProfileComponent implements OnInit {

  public addForm!: FormGroup;
  @Input() public isAddMode: boolean | undefined;
  @Input() public employee: Employee | undefined;

  fileName : any;
  id!: string;
  submitted = false;
  formData = new FormData();
  constructor( private form: FormBuilder ,
     private employeeService:EmployeeService ,
     private route: ActivatedRoute, public modal: NgbActiveModal) {
    this.createForm();
  }


  ngOnInit(): void {
        if (!this.isAddMode) {
           if(this.employee){
            this.addForm.patchValue(this.employee);
            this.addForm.get('availabilityDate')?.patchValue(this.formatDate(this.employee.availabilityDate));
            this.addForm.get('startDate')?.patchValue(this.formatDate(this.employee.startDate));
            this.fileName = this.employee.cv.split('/images/')[1];

          }
        }
  }
  createForm() {
    this.addForm = this.form.group({
      firstName:['', Validators.required ],
      lastName:['', Validators.required ],
      phone:['', Validators.required ],
      city:['', ],
      zipCode:['', Validators.required ],
      salary:['', Validators.required ],
      fonction: ['', Validators.required ],
      pole: ['', Validators.required ],
      field:['', Validators.required ],
      comments:[''],
      availabilityDate: ['',],
      startDate: [''],
      cv : [null, Validators.required ],

    });

  }
  get f() { return this.addForm.controls; }

  submit() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.addForm.invalid) {
        return;
    }
    else {
      if(this.isAddMode){
        if(this.addForm.valid){
          this.employeeService.add(
                this.addForm.value,this.fileName
           );
          this.modal.dismiss();
          this.employeeService.getAll();
        }
      }
      else {
        console.log(this.employee);
        if(this.employee){
          this.employeeService.update(this.employee._id,this.addForm.value,this.fileName);
        }

      }
    }

  }
  private formatDate(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  onSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files)
    {
      const file = target.files[0];
      this.addForm.get('cv')?.setValue(file.name);
      this.addForm.get('cv')?.updateValueAndValidity();

    }

  }
  onFileSelected(event:Event) {
    const target = event.target as HTMLInputElement;

    if  (target && target.files){

        const file:File = target.files[0];
        console.log(file);
        this.fileName = file;
        this.formData.append("uploads[]", file, file.name);
        this.addForm.get('cv')?.setValue(file.name);
        this.addForm.get('cv')?.updateValueAndValidity();


    }
}

}
