
export class Address{
    //Address
    id:number
    address:string;
    city:string;
    country:string;
    doorNumber:number;
    floor:number;
    postcode:string;
    region:string;
    lat:string;
    long:string;

    constructor(id:number,
        address:string,
        city:string,
        country:string,
        doorNumber:number,
        floor:number,
        postcode:string,
        region:string,
        lat:string,
        long:string){

        this.id=id;
        this.address = address;
        this.city=city;
        this.country=country;
        this.doorNumber=doorNumber;
        this.floor=floor;
        this.postcode=postcode;
        this.region=region;
        this.lat=lat;
        this.long=long;
        }
}   


