import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  loginUser(loginForm:NgForm){
    console.log(loginForm.value)
    console.log(loginForm)
  }

}
