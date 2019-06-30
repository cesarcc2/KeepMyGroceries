import { Component, OnInit, ViewChild } from '@angular/core';
import { DBService} from '../services/db.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Post } from '../models/post';
import { Calendar } from '../models/calendar';

@Component({
  selector: 'app-use-service',
  templateUrl: './use-service.page.html',
  styleUrls: ['./use-service.page.scss'],
})
export class UseServicePage implements OnInit {
  Post:Post;
  public SubmitUserServiceForm: FormGroup;
  @ViewChild('datePickerRecieveHour')datePickerRecieveHour;
  @ViewChild('datePickerDeliverHour')datePickerDeliverHour;


  ViewLoaded:boolean=false;

  //Creation of calendar
  CalendarCreator = new Calendar();
  Calendar:Array<any>;
  Availability:Array<string>;
  AvailableDays;
  highlighted: number;
  highlightedRecieveDay:number;
  highlightedDeliverDay:number;
  weekNames:Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
  "Saturday"];
  monthNames:Array<string> = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

  //Selection of dates
  RecievingDay:string;
  DeliverDay:string;
  RecievingHour:string;
  DeliverHour:string;
  Parameter:string = "RecieveDay";
  Instructions:string="Select the Recieving Day";


  constructor(private DB:DBService,private router:Router,private Route:ActivatedRoute,private formBuilder:FormBuilder) { 

    this.SubmitUserServiceForm = formBuilder.group({
      Homedelivery: [''],
      Details: ['']
    });

  }
  

  ngOnInit() {
    this.DB.GetActivePosts().then((result)=>{
      this.Post = this.DB.ActivePosts.GetPostByID(this.Route.snapshot.paramMap.get("post"));
      console.log(this.Post);
      this.Availability = [''];
      this.Calendar = this.CalendarCreator.createCalendar();
      this.getDays().then((AvailableDays)=>{
        this.AvailableDays = AvailableDays;
        console.log(this.Availability[0]);
        this.ViewLoaded = true;
      });
    }).catch((error)=>{
      console.log(error);
    });
  }

  getDays(){
    return new Promise((resolve,reject)=>{
      let AvailableDays = [];
      let AvailableDaysWithHours = [];
    
      
        Object.values(this.Post.SlotList['SlotsList']).forEach(slot => {
          console.log(slot);
          let Slot = [];
          let date1:Date = new Date(slot['daybegin']);
          let date2:Date = new Date(slot['dayend']);
          for(let i=date1.getUTCDate();i<=date2.getUTCDate();i++){
            let date1X:Date= new Date (date1.setUTCDate(i));
            Slot.push(date1X.getUTCDate());
            AvailableDays.push(date1X.getUTCDate());
          }
            Slot.push(slot['hourbegin'],slot['hourend']);
            AvailableDaysWithHours.push(Slot);
        });
        console.log(AvailableDays);
        this.Availability = AvailableDaysWithHours;
        resolve(AvailableDays);
    });
  }

  DaySelected(Day){
    if (Day == ''){}else{
      for (let indexSlot = 0; indexSlot < this.Availability.length; indexSlot++) {
        for (let indexDay = 0; indexDay < this.Availability[indexSlot].length; indexDay++) {
          if( indexDay == (this.Availability[indexSlot].length -1) || indexDay == (this.Availability[indexSlot].length -2)){break}
            if(this.Availability[indexSlot][indexDay] == Day){

              if(this.Parameter == "RecieveDay"){
                this.highlightedRecieveDay = Day;
                this.RecievingDay = this.DayNumbertoDate(Day);
                if(!this.DeliverDay){this.Parameter = "DeliverDay";}else{this.Parameter = "";}
                this.CreateDeliveryLimitations(Day);
                this.getAvailableTime(this.Availability[indexSlot]);
                this.datePickerRecieveHour.open();
                this.Instructions = "Select the Delivery Day"

                if(this.RecievingDay> this.DeliverDay){
                  this.DeliverDay= undefined;
                  this.Parameter = "DeliverDay";
                  this.highlightedDeliverDay = 0;
                }
              }else if (this.Parameter == "DeliverDay"){
                if(this.highlightedRecieveDay>Day){
                }else{
                  this.highlightedDeliverDay = Day;
                  this.DeliverDay = this.DayNumbertoDate(Day);
                  this.Parameter = "";
                  this.Instructions = "";
                  this.getAvailableTime(this.Availability[indexSlot]);
                  this.datePickerDeliverHour.open();
                  console.log("highlightedDeliverDay: " + this.highlightedDeliverDay);
                }
              }else{
                let ColToEnable = document.getElementById("RecieveDay" + this.Availability[indexSlot][indexDay]);
                if(ColToEnable.className == "DayInvalid hydrated"){
                }else{
                  this.highlighted = Day;
                }
              }
          } //IF day is found in Slot
        } //For indexDay
      } //For indexSlot
    }
  }

  DatePickerChange(data){
    let datePicker = data.path['0'].id;
    let value = data.detail.value;
    switch (datePicker) {
      case 'datePickerRecieveHour':
        this.RecievingHour = value;
        break;
      case 'datePickerDeliverHour':
      this.DeliverHour = value;
        break;
    }
  }

  CreateDeliveryLimitations(Day){
    for (let indexSlot = 0; indexSlot < this.Availability.length; indexSlot++) {

      for (let indexDay = 0; indexDay < this.Availability[indexSlot].length; indexDay++) {

        if( indexDay == (this.Availability[indexSlot].length -1) || indexDay == (this.Availability[indexSlot].length -2)){break}
        
        if(this.Availability[indexSlot][indexDay] < Day){

          let ColToEnable = document.getElementById("RecieveDay" + this.Availability[indexSlot][indexDay]);
          ColToEnable.setAttribute("class", "DayInvalid hydrated");
          
        } //IF day is found in Slot

      } //For indexDay

    } //For indexSlot
  }

  DayNumbertoDate(Day){
    let SelectedDate:Date = new Date(new Date().setDate(Day));
    return SelectedDate.getDate() + "-" + SelectedDate.getMonth() + "-" + SelectedDate.getFullYear();
  }

  getAvailableTime(Availability){
    let AvailableTimePeriodBegin = Availability[(Availability.length)-2];
    let AvailableHourBegin = AvailableTimePeriodBegin.substring(0,2);
    let AvailableMinuteBegin = AvailableTimePeriodBegin.substring(3,5);
    let AvailableTimePeriodEnd = Availability[(Availability.length)-1];
    let AvailableHourEnd = AvailableTimePeriodEnd.substring(0,2);
    let AvailableMinuteEnd = AvailableTimePeriodEnd.substring(3,5);
    let availableHours ="";
    for(let i = AvailableHourBegin;i<=AvailableHourEnd;i++){
      availableHours = availableHours + +i + ",";
    }

    let availableMinutes ="";
    for(let i = AvailableMinuteBegin;i<=AvailableMinuteEnd;i++){
      availableMinutes = availableMinutes + +i + ",";
    }
    this.datePickerRecieveHour.hourValues = availableHours.slice(0, -1);
    this.datePickerRecieveHour.minuteValues = availableMinutes.slice(0, -1);
    this.datePickerDeliverHour.hourValues = availableHours.slice(0, -1);
    this.datePickerDeliverHour.minuteValues = availableMinutes.slice(0, -1);
  }

  Submit(){
    if(this.RecievingDay && this.RecievingHour && this.DeliverDay && this.DeliverHour){
      let homedelivery = this.SubmitUserServiceForm.value['Homedelivery'];
      if(homedelivery == ""){homedelivery=false;}
      let details = this.SubmitUserServiceForm.value['Details'];
      console.log(this.RecievingDay,this.RecievingHour.substring(this.RecievingHour.indexOf("T") + 1),this.DeliverDay,this.DeliverHour.substring(this.DeliverHour.indexOf("T") + 1),homedelivery,details,this.Post.id);
      this.DB.SetOrder(this.RecievingDay,this.RecievingHour.substring(this.RecievingHour.indexOf("T") + 1).substr(0,this.RecievingHour.substring(this.RecievingHour.indexOf("T") + 1).indexOf(".")),this.DeliverDay,this.DeliverHour.substring(this.DeliverHour.indexOf("T") + 1).substr(0,this.DeliverHour.substring(this.DeliverHour.indexOf("T") + 1).indexOf(".")),homedelivery,details,this.Post.id).then(() =>{this.router.navigate(['main//tab1']);});
    }
  }
}
