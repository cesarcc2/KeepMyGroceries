import { Component } from '@angular/core';
import { DBService } from '../services/db.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public DB:DBService, public router:Router){}


  LogOut(){
    this.DB.LogOut();
    console.log("Token: " + localStorage.getItem("Token"));
  }

}
