import { Address } from '../models/address';

export class User{
    id:number;
    role:number;
    name:string;
    surname:string;
    birthdate:any;
    address:Address;
    email:string;
    phoneNumber:any;
    description:any;
    photo:any;
    password:string;

    public constructor(id:number,
                       name:string,
                       surname:string,
                       role:number,
                       password:string,
                       email:string,
                       birthdate?:any,
                       address?:any,
                       phoneNumber?:any,
                       description?:any,
                       photo?:any){

        this.id=id;
        this.name=name;
        this.surname=surname;
        this.password=password;
        this.email=email;
        this.birthdate=birthdate;
        this.address=address;
        this.phoneNumber=phoneNumber;
        this.description=description;
        this.photo=photo;
        this.role=role;
    }



UpdateData(id:number,role:number,name:string,surname:string,password:string,birthdate?:string,address?:number,email?:string,phoneNumber?:number,description?:string,photo?:string){}

Delete(){}

IsLogged(){}

UpdateHostData(){}

GetRole(){
    return this.role;
}

GetID(){
    return this.id;
}

HasHostData(){
    if (!this.description || !this.phoneNumber || !this.photo){
        return false;
      }
      return true;
}

UpdateRole(){
    this.role=3;
}

}

