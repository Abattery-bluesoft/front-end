import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router, Params } from '@angular/router';
import { emailDomainValidator } from 'src/app/validators/email.validator';
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {

  public authForm!: FormGroup;
  submitted = false;

  page:string | undefined; 
  submitBtn:string;

  constructor(private form: FormBuilder, private authService: AuthService , private router:Router) {
    this.page = this.router.url === '/signup' ? 'register':'login';
    this.submitBtn = this.router.url === '/signup' ? "s'inscrire" : 'se connecter';
  }

  ngOnInit(): void {
    this.authForm = this.form.group({
        email: new FormControl("", {
          validators: [Validators.required, Validators.email , emailDomainValidator],
          updateOn: 'blur'}),
        password: new FormControl("",{ validators:[ Validators.required], updateOn: 'blur' }),
    },
    {
      validator: this.page === 'register' ? MustMatch('password', 'confirmPassword') : ''
    }
    );
    if(this.page === 'register'){
      this.authForm.addControl('confirmPassword',this.form.control('', Validators.required));
    }
  }
  get f() {
    return this.authForm.controls;
  }

  submit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    } else {
      const email = this.authForm.value.email;
      const password = this.authForm.value.password;
      if(this.page === 'register') {
        this.authService.signUp(email , password )
        .then(()=> this.router.navigate(['/list']))
        .catch(err=>console.log(err))
      } else {
        this.authService.login(email , password )
        .then(()=> this.router.navigate(['/list']))
        .catch(err=>console.log(err))
      }
      
    }
  }
}
