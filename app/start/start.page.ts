import { Component, OnInit, ViewChild } from '@angular/core';
import { DBService } from '../services/db.service';
import { IonSlides } from '@ionic/angular'
import { Router, Route } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  public LoginForm: FormGroup;
  public RegisterForm: FormGroup;
  constructor(public router: Router, public DB: DBService, public formBuilder: FormBuilder, public location: Location) {

    this.LoginForm = formBuilder.group({
      loginEmail: ['', Validators.required],
      loginPassword: ['', Validators.required]
    });

    this.RegisterForm = formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confPassword: ['', Validators.required]
    });
  }

  @ViewChild('sliders') slider: IonSlides;

  warningMessageLogin: string;
  warningMessageRegister: string;
  tabs = "Login";

  SlideOpts = {
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    }
  }

  ngOnInit() {
    this.slider.lockSwipes(true);
  }

  KMGLogin() {
    this.slider.lockSwipes(false);
    this.slider.slideTo(1).then(() => { this.slider.lockSwipes(true) });
  }

  Start() {
    this.slider.lockSwipes(false);
    this.slider.slideTo(0).then(() => { this.slider.lockSwipes(true) });
  }

  skip() {
    this.router.navigate(['/main/tab1']);
  }

  Login() {
    let email = this.LoginForm.value['loginEmail'];
    let password = this.LoginForm.value['loginPassword'];
    this.DB.Login(email, password).then(result => {
      console.log("Token: " + localStorage.getItem("Token"));
      this.router.navigate(['/main/tab1']);
    }).catch(error => {
      this.warningMessageLogin = error;
    });
  }

  Register() {
    let name = this.RegisterForm.value['name'];
    let surname = this.RegisterForm.value['surname'];
    let email = this.RegisterForm.value['email'];
    let password = this.RegisterForm.value['password'];
    let confPassword = this.RegisterForm.value['confPassword'];

    this.DB.Register(name, surname, email, password, confPassword).then(result => {
      this.router.navigate(['/main/tab1']);
    }).catch(error => {
      this.warningMessageRegister = error;
    });
  }
}
