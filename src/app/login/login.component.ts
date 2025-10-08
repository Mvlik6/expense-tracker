import { Component } from '@angular/core';
import { DataManagerService } from '../data-manager.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LoginForm : FormGroup;
  constructor(private dm : DataManagerService, private auth : AngularFireAuth, private router : Router){
    this.LoginForm = new FormGroup({
      'email': new FormControl('',[Validators.required, Validators.email]),
      'password': new FormControl('',Validators.required)
    })
  }
  ngOnInit(): void{

  }
  onSubmit(){
    
    if (this.LoginForm.invalid)
      return;
    this.dm.login(this.LoginForm.value.email, this.LoginForm.value.password).then((result)=>{
      if (result == null){
        this.router.navigate(['/dashboard']);
      }
      else if (result.isValid == false){
        console.log('Error logging in');
        this.router.navigate(['/signup']);
      }
    })
  }
}
