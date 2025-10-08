import { Component } from '@angular/core';
import { DataManagerService } from '../data-manager.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpForm : FormGroup;
  constructor(private dm : DataManagerService, private auth : AngularFireAuth, private router : Router){

  }
  ngOnInit(): void{
    this.signUpForm = new FormGroup({
      'displayName': new FormControl('',[Validators.required]),
      'email': new FormControl('',[Validators.required, Validators.email]),
      'password': new FormControl('',Validators.required)
    })
  }
  onSubmit(){
    if (this.signUpForm.invalid)
      return;
    this.dm.signup(this.signUpForm.value).then((result)=> {
      if (result == null){
        console.log('success')
        this.router.navigate(['/dashboard']);
      }
      else if (result.isValid == false){
        console.log('Error')
      }
    }).catch(()=>{

    });
  }
}
