import { Post } from './post';

export class Slot {

    private id: number;
    private daybegin: Date;
    private dayend: Date;
    private hourbegin: Date;
    private hourend: Date;
    private slotDate: Date;

    constructor() {
    }


    getID() {
        return this.id;
    }

    getDayBegin() {
        return this.daybegin;
    }

    getDayEnd() {
        return this.dayend;
    }

    getHourBegin() {
        return this.hourbegin;
    }

    getHourEnd() {
        return this.hourend;
    }

    getDate() {
        return this.slotDate;
    }



    SetID(value){
        this.id = value;
    }

    SetDayBegin(value) {
        this.daybegin = value;
    }

    SetDayEnd(value) {
        this.dayend = value;
    }

    SetHourBegin(value) {
        this.hourbegin = value;
    }

    SetHourEnd(value) {
        this.hourend = value;
    }

    SetDate(value) {
        this.slotDate = value;
    }

    Delete() { }


    isValidForSubmition(){
        if (this.daybegin == undefined || this.dayend == undefined || this.hourbegin == undefined || this.hourend == undefined){
            return false;
        } else{
            return true;
        }
    }
}   
