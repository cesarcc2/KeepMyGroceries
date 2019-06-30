import { Slot } from "./slot";

export class SlotsList {
    SlotsList:Array<any>;

    constructor(
    ){
        this.SlotsList = [];
    }

    public AddSlot(Slot:Slot){
        this.SlotsList.push(Slot);
        // console.log("1");
    }

    public NumberOfSlots(){
        return this.SlotsList.length;
    }

    RemoveSlot(index){
        this.SlotsList.splice(index, 1);
    }

    GetAll(){
        return this.SlotsList;
    }
}