import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from '@angular/router';
import { emailDomainValidator } from 'src/app/validators/email.validator';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  submitted = false;

  constructor(private form: FormBuilder, private authService: AuthService , private router:Router) {}

  ngOnInit(): void {
    this.loginForm = this.form.group({
        email: new FormControl("", {
          validators: [Validators.required, Validators.email , emailDomainValidator],
          updateOn: 'blur'}),
        password: new FormControl("",{ validators:[ Validators.required], updateOn: 'blur' }),
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  submit() {
    this.submitted = true;
    console.log(this.loginForm);
    if (this.loginForm.invalid) {
      return;
    } else {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authService.login(email , password )
      .then(()=> this.router.navigate(['/list']))
      .catch(err=>console.log(err))
    }
  }
}
