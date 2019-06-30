import { User } from "../models/user";

export class UserHost extends User{
    role:number = 3;


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
        
        super(id,name,surname,role,password,email,birthdate,address,phoneNumber,description,photo);
        this.role=3;
    }



UpdateData(id:number,role:number,name:string,surname:string,password:string,birthdate?:string,address?:number,email?:string,phoneNumber?:number,description?:string,photo?:string){}

Delete(){}


 
}

