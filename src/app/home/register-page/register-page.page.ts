import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.page.html',
  styleUrls: ['./register-page.page.scss'],
})
export class RegisterPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  registerUser(registerForm:NgForm){
    delete registerForm.value['ConfirmPassword'];
    console.log(registerForm.value)
  }
}
