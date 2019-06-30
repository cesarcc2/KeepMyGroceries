
export class Calendar{
    Today = new Date();
    week = [];
    month = (this.Today.getUTCMonth())+1;
    year = this.Today.getUTCFullYear();
    FirstDayOfMonth = new Date(this.Today.setUTCDate(1));
    LengthOfMonth:Date = new Date(this.Today.getFullYear(), this.Today.getUTCMonth()+1, 0);
    numberOfWeeks = this.weekCount(this.year,this.month,this.FirstDayOfMonth.getDay());


    constructor(){
        
    }

createCalendar(){
    if (this.LengthOfMonth.getDay() == 0 || this.LengthOfMonth.getDate()==28){
        this.numberOfWeeks = (this.weekCount(this.year,this.month,this.FirstDayOfMonth.getDay())+1);
    }

    // console.log(Today);
    let indexDay = 1;
    let LimitIndexDay =7;

    for (let indexWeek = 1; indexWeek <= this.numberOfWeeks ; indexWeek++) {
      let Days = [];
      if(indexWeek == this.numberOfWeeks){
        LimitIndexDay = (this.LengthOfMonth.getDate());
      }
      for(indexDay;indexDay<=LimitIndexDay;indexDay++){
        // console.log("Week : " + indexWeek + "dia " + indexDay + "  até " + LimitIndexDay);
        let day:Date= new Date (this.Today.setUTCDate(indexDay));
        if (indexDay>31){

          indexDay = LimitIndexDay;

        }else if(indexDay== 1){

          switch (day.getDay()) {
            case 0:

            LimitIndexDay = 7;
              break;
            case 1:
            this.FillEmptyWeekDays(1,Days);
            LimitIndexDay = 6;
              break;
            case 2:
            this.FillEmptyWeekDays(2,Days);
            LimitIndexDay = 5;
              break;
            case 3:
            this.FillEmptyWeekDays(4,Days);
            LimitIndexDay = 4;
              break;
            case 4:
            this.FillEmptyWeekDays(4,Days);
            LimitIndexDay = 3;
              break;
            case 5:
            this.FillEmptyWeekDays(5,Days);
            LimitIndexDay = 2;
              break;
            case 6:
            this.FillEmptyWeekDays(6,Days);
            LimitIndexDay = 1;
              break;
          }
        }
        Days.push(day.getDate());
      }
      indexDay = LimitIndexDay+1;
      LimitIndexDay = LimitIndexDay + 7;
      if(indexWeek == this.numberOfWeeks){
        switch (Days.length) {
          case 1:
          this.FillEmptyWeekDays(6,Days);
            break;
          case 2:
          this.FillEmptyWeekDays(5,Days);
            break;
          case 3:
          this.FillEmptyWeekDays(4,Days);
            break;
          case 4:
          this.FillEmptyWeekDays(3,Days);
            break;
          case 5:
          this.FillEmptyWeekDays(2,Days);
            break;
          case 6:
          this.FillEmptyWeekDays(1,Days);
            break;
          case 7:
            
            break;
          default:
            break;
        }
      }
      this.week.push(Days);
    }

    return this.week;
    // console.log(Week);
  }

  weekCount(year, month_number, startDayOfWeek) {
    // month_number is in the range 1..12
  
    // Get the first day of week week day (0: Sunday, 1: Monday, ...)
    let firstDayOfWeek = startDayOfWeek || 0;
  
    let firstOfMonth = new Date(year, month_number-1, 1);
    let lastOfMonth = new Date(year, month_number, 0);
    let numberOfDaysInMonth = lastOfMonth.getDate();
    let firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;
  
    let used = firstWeekDay + numberOfDaysInMonth;
  
    return Math.ceil( used / 7);
  }

  FillEmptyWeekDays(days,DaysArr){
    for (let i = 0; i < days; i++) {
      DaysArr.push('');
    }
  }
}